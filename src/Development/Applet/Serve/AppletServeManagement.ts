import * as http from 'http';
import * as path from 'path';
import * as os from "os";
import * as fs from 'fs-extra';
import * as child_process from 'child_process';
import { getPackagePublicPath, RUNTIME_DIRNAME } from "../../runtimeFileSystem";
import { AppletServer } from './AppletServer';
import { getMachineRemoteAddr } from '../../../Utils/network';
import { killGracefullyWithTimeoutSigKill } from '../../../Utils/process';
import * as Debug from 'debug';
import wait from '../../../Timer/wait';

const debug = Debug('@signageos/sdk:Development:Applet:Serve:AppletServeManagement');

const GRACEFUL_KILL_TIMEOUT_MS = 5000;
const DEFAULT_SERVER_PORT = 8091;
const PORT_FILENAME = 'port';
const PID_FILENAME = 'pid';
const PARENTS_FILENAME = 'parents';
const APPLET_SERVERS_DIRENAME = 'applet_servers';

interface DetachedProcess {
	pid: number;
	kill(signal: NodeJS.Signals): boolean;
	once(event: 'close', listener: () => void): void;
}

export interface IServeOptions {
	/** Applet UID that is used for targeting the temporary build folder */
	appletUid: string;
	/** Applet version that is used for targeting the temporary build folder. It should match the version in package.json */
	appletVersion: string;
	/**
	 * The port on which the applet will be served.
	 * If not specified, the default port 8091 will be used.
	 */
	port?: number;
	/**
	 * The public URL where the server will be available.
	 * It can differ from localhost or local network IP address in case the reverse proxy is used.
	 */
	publicUrl?: string;
}

/**
 * Manages applet server for development purposes.
 * It is used to serve applet package archive (.package.zip built be AppletBuildManagement).
 */
export class AppletServeManagement {

	/**
	 * Creates the applet server and serves the applet package archive on a specific location that is accepted by devices as applet.
	 * So the device can be swhitched to the development mode and the applet can be loaded from this server instead of production server.
	 * If the server is not running for the applet and version (on specified port) it will start new one.
	 * If the server is already running for the applet and version (on specified port) it will return the existing one.
	 * So basically the method is idempotent.
	 * It throws an error if the server is already running for the applet and version but on different port.
	 * The option `publicUrl` is not validated and it is used only for logging into console.
	 */
	public async serve(options: IServeOptions) {
		const { port, publicUrl, remoteAddr } = this.getServerProperties(options);
		const processPid = process.pid;
		const processUid = Math.random().toString(36).substring(7);

		let serverProcess: DetachedProcess;

		const cleanUp = async () => {
			process.removeListener('exit', cleanUp);
			await this.cleanUpServer(options.appletUid, options.appletVersion, serverProcess, processPid, processUid);
		};
		process.addListener('exit', cleanUp);

		const running = await this.validateRunningServer(options.appletUid, options.appletVersion, port);
		debug('Running server', running);
		await this.addToParentsFile(options.appletUid, options.appletVersion, processPid, processUid);

		if (running) {
			serverProcess = await this.getRunningProcess(running.pid);
			return new AppletServer(
				processUid,
				running.port,
				publicUrl,
				remoteAddr,
				cleanUp,
			);
		}

		await this.createPortFile(options.appletUid, options.appletVersion, port);

		serverProcess = await this.startServerProcess(options.appletUid, options.appletVersion, port, publicUrl);
		await this.createPidFile(options.appletUid, options.appletVersion, serverProcess.pid);
		debug('Server process started', serverProcess.pid);

		return new AppletServer(
			processUid,
			port,
			publicUrl,
			remoteAddr,
			cleanUp,
		);
	}

	/**
	 * Return the port of currently running applet server.
	 * It returns null if the server is not running.
	 * It verify if the port is responding and if not it cleans up the port file and return null.
	 */
	public async getRunningPort(appletUid: string, appletVersion: string) {
		const portFilePath = this.getRuntimePortFile(appletUid, appletVersion);
		if (await fs.pathExists(portFilePath)) {
			const port = parseInt(await fs.readFile(portFilePath, 'utf8'));
			debug('Port file exists', port);
			if (await this.isPortInUse(appletUid, appletVersion, port)) {
				return port;
			} else {
				// Only clean up the port file if the port is not in use anymore
				await this.deletePortFile(appletUid, appletVersion);
				return null;
			}
		} else {
			return null;
		}
	}

	/**
	 * Kill the running applet server if it is running.
	 * It does not throw an error if the server is not running.
	 * It tries to kill the server gracefully and if it fails it kills it with SIGKILL.
	 * It will kill even the parent process if it is still running.
	 * If parent process is not running it will kill only the orphant server process.
	 */
	public async killRunningServer(appletUid: string, appletVersion: string) {
		const parents = await this.getParents(appletUid, appletVersion);
		if (parents.length > 0) {
			for (const parent of parents) {
				const { pid: parentPid } = this.parseParentPidAndUid(parent);
				const parentProcess = await this.getRunningProcess(parentPid);
				await killGracefullyWithTimeoutSigKill(parentProcess, GRACEFUL_KILL_TIMEOUT_MS);
			}
		}

		const runningPid = await this.getRunningPid(appletUid, appletVersion);
		if (runningPid) {
			const serverProcess = await this.getRunningProcess(runningPid);
			await killGracefullyWithTimeoutSigKill(serverProcess, GRACEFUL_KILL_TIMEOUT_MS);
		}
	}

	private async cleanUpServer(
		appletUid: string,
		appletVersion: string,
		serverProcess: DetachedProcess,
		parentPid: number,
		processUid: string,
	) {
		await this.removeFromParentsFile(appletUid, appletVersion, parentPid, processUid);

		const parents = await this.getParents(appletUid, appletVersion);
		if (parents.length === 0) {
			await killGracefullyWithTimeoutSigKill(serverProcess, GRACEFUL_KILL_TIMEOUT_MS);
			await this.deleteAppletRuntimeDir(appletUid);
		}
	}

	private async getRunningPid(appletUid: string, appletVersion: string) {
		const pidFilePath = this.getRuntimePidFile(appletUid, appletVersion);
		if (await fs.pathExists(pidFilePath)) {
			const pid = parseInt(await fs.readFile(pidFilePath, 'utf8'));
			debug('Pid file exists', pid);
			if (this.isProcessRunningByPid(pid)) {
				return pid;
			} else {
				// Only clean up the pid file if the process is not running anymore
				await this.deletePidFile(appletUid, appletVersion);
				return null;
			}
		} else {
			return null;
		}
	}

	private async getParents(appletUid: string, appletVersion: string) {
		const parentsFilePath = this.getRuntimeParentsFile(appletUid, appletVersion);
		if (await fs.pathExists(parentsFilePath)) {
			const possibleParents = await this.readParentsFile(parentsFilePath);
			const parents = possibleParents.filter((parent) => this.isProcessRunningByPid(this.parseParentPidAndUid(parent).pid));
			const notRunningParents = possibleParents.filter((parent) => !parents.includes(parent));
			debug('Parents file exists', possibleParents, parents, notRunningParents);
			for (const notRunningParent of notRunningParents) {
				const { pid: notRunningPid, uid: notRunningProcessUid } = this.parseParentPidAndUid(notRunningParent);
				await this.removeFromParentsFile(appletUid, appletVersion, notRunningPid, notRunningProcessUid);
			}
			return parents;
		} else {
			return [];
		}
	}

	private parseParentPidAndUid(parent: string) {
		const [pid, uid] = parent.split('/');
		return { pid: parseInt(pid), uid };
	}

	private async validateRunningServer(appletUid: string, appletVersion: string, port: number) {
		const runningPid = await this.getRunningPid(appletUid, appletVersion);
		const runningPort = await this.getRunningPort(appletUid, appletVersion);
		debug('Running server', { runningPid, runningPort });

		if (!runningPid && !runningPort) {
			if (await this.isPortInUse(appletUid, appletVersion, port)) {
				throw new Error(
					`Requested port ${port} is already in use by another process`,
				);
			}
			return null;
		}

		if (runningPort && !runningPid) {
			throw new Error(
				`Requested port ${port} is already in use by unknown process`,
			);
		}

		if (runningPid && !runningPort) {
			throw new Error(
				`Applet server ${appletUid}@${appletVersion} is already running but on unknown port`,
			);
		}

		if (runningPid && runningPort !== port) {
			throw new Error(
				`Applet server ${appletUid}@${appletVersion} is already running on port ${runningPort} so it cannot be started on port ${port}`,
			);
		}

		if (!runningPort || !runningPid) {
			throw new Error(
				`Unknown error while validating running server ${appletUid}@${appletVersion} on port ${port}`,
			);
		}

		return {
			port: runningPort,
			pid: runningPid,
		};
	}

	private async isPortInUse(appletUid: string, appletVersion: string, port: number) {
		const packagePublicPath = getPackagePublicPath(appletUid, appletVersion);
		const request = http.request({ port, method: 'HEAD', path: packagePublicPath });
		const promise = new Promise<boolean>((resolve) => {
			request.once('response', () => resolve(true));
			request.once('error', () => resolve(false));
		});
		request.end();
		return await promise;
	}

	private isProcessRunningByPid(pid: number) {
		try {
			process.kill(pid, 0); // throws an error if the process doesn't exist
			return true;
		} catch (error) {
			return false;
		}
	}

	private getServerProperties(options: IServeOptions) {
		const remoteAddr = getMachineRemoteAddr();
		const port = options.port ?? DEFAULT_SERVER_PORT;
		const publicUrl = options.publicUrl ?? `http://${remoteAddr}:${port}`;

		return {
			port,
			publicUrl,
			remoteAddr,
		};
	}

	private async getRunningProcess(pid: number): Promise<DetachedProcess> {
		const appletServerProcess: DetachedProcess = {
			pid,
			kill: (signal: NodeJS.Signals) => {
				try {
					const killed = process.kill(pid, signal);
					debug('Killed process', { pid, signal, killed });
					return killed;
				} catch (error) {
					debug('Error killing process', { pid, signal, error });
					return false;
				}
			},
			once: async (_event: 'close', listener: () => void) => {
				while (this.isProcessRunningByPid(pid)) {
					debug('Waiting for process to close', { pid });
					await wait(100);
				}
				listener();
			},
		};
		return appletServerProcess;
	}

	private async startServerProcess(appletUid: string, appletVersion: string, port: number, publicUrl: string) {
		const serverPath = path.join(__dirname, 'AppletServerProcess');
		const serverProcess = child_process.fork(serverPath, [appletUid, appletVersion, port.toString(), publicUrl], {
			detached: true,
			stdio: 'ignore',
			execArgv: process.env.SOS_DEVELOPMENT_APPLET_SERVE_EXEC_ARGV?.split(' '),
		});
		const message = await new Promise((resolve, reject) => {
			serverProcess.once('message', resolve);
			serverProcess.once('error', reject);
		});
		if (message !== 'ready') {
			throw new Error(`Unexpected message from server process: ${message}`);
		}
		if (serverProcess.pid === null) {
			throw new Error('Server process was not started properly');
		}
		while (!await this.isPortInUse(appletUid, appletVersion, port)) {
			await wait(100);
		}
		return serverProcess as DetachedProcess;
	}

	private async deleteAppletRuntimeDir(appletUid: string) {
		await fs.remove(this.getAppletRuntimeDir(appletUid));
	}

	private async createPortFile(appletUid: string, appletVersion: string, serverPort: number) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		await fs.ensureDir(runtimeDir);
		const portFilePath = this.getRuntimePortFile(appletUid, appletVersion);
		await fs.writeFile(portFilePath, serverPort.toString());
	}

	private async deletePortFile(appletUid: string, appletVersion: string) {
		await fs.remove(this.getRuntimePortFile(appletUid, appletVersion));
	}

	private async createPidFile(appletUid: string, appletVersion: string, pid: number) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		await fs.ensureDir(runtimeDir);
		const pidFilePath = this.getRuntimePidFile(appletUid, appletVersion);
		await fs.writeFile(pidFilePath, pid.toString());
	}

	private async deletePidFile(appletUid: string, appletVersion: string) {
		await fs.remove(this.getRuntimePidFile(appletUid, appletVersion));
	}

	private async readParentsFile(parentsFilePath: string) {
		const parentsRaw = await fs.pathExists(parentsFilePath) ? await fs.readFile(parentsFilePath, 'utf8') : '';
		debug('readParentsFile', parentsRaw);
		const currentParents = parentsRaw.split(',').filter((parents) => parents);
		return currentParents;
	}

	private async addToParentsFile(appletUid: string, appletVersion: string, pid: number, processUid: string) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		await fs.ensureDir(runtimeDir);
		const parentsFilePath = this.getRuntimeParentsFile(appletUid, appletVersion);
		const currentParents = await this.readParentsFile(parentsFilePath);
		currentParents.push(pid + '/' + processUid);
		await fs.writeFile(parentsFilePath, currentParents.join(','));
	}

	private async removeFromParentsFile(
		appletUid: string,
		appletVersion: string,
		parentPidToRemove: number,
		parentProcessUidToRemove: string,
	) {
		const parentsFilePath = this.getRuntimeParentsFile(appletUid, appletVersion);
		const currentParents = await this.readParentsFile(parentsFilePath);
		const index = currentParents.indexOf(parentPidToRemove + '/' + parentProcessUidToRemove);
		if (index >= 0) {
			currentParents.splice(index, 1);
			await fs.writeFile(parentsFilePath, currentParents.join(','));
		}
	}

	private getRuntimePortFile(appletUid: string, appletVersion: string) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		return path.join(runtimeDir, PORT_FILENAME);
	}

	private getRuntimePidFile(appletUid: string, appletVersion: string) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		return path.join(runtimeDir, PID_FILENAME);
	}

	private getRuntimeParentsFile(appletUid: string, appletVersion: string) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		return path.join(runtimeDir, PARENTS_FILENAME);
	}

	private getAppletVersionRuntimeDir(appletUid: string, appletVersion: string) {
		const tempDir = path.join(this.getAppletRuntimeDir(appletUid), appletVersion);
		return tempDir;
	}

	private getAppletRuntimeDir(appletUid: string) {
		const tempDir = path.join(os.tmpdir(), RUNTIME_DIRNAME, APPLET_SERVERS_DIRENAME, appletUid);
		return tempDir;
	}
}
