import * as http from 'http';
import * as express from 'express';
import * as cors from "cors";
import * as path from 'path';
import * as os from "os";
import * as fs from 'fs-extra';
import chalk from "chalk";
import { getAppletPackageArchivePath, PACKAGE_ARCHIVE_FILENAME, RUNTIME_DIRNAME } from "../../runtimeFileSystem";
import { log } from '../../../Console/log';
import { AppletServer } from './AppletServer';
import { getMachineRemoteAddr } from '../../../Utils/network';

const DEFAULT_SERVER_PORT = 8080;
const PORT_FILENAME = 'port';
const APPLET_SERVERS_DIRENAME = 'applet_servers';

export interface IServeOptions {
	/** Applet UID that is used for targeting the temporary build folder */
	appletUid: string;
	/** Applet version that is used for targeting the temporary build folder. It should match the version in package.json */
	appletVersion: string;
	/**
	 * The port on which the applet will be served.
	 * If not specified, the default port 8080 will be used.
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
	 */
	public async serve(options: IServeOptions) {
		await this.validateRunningServer(options.appletUid, options.appletVersion);

		const server = this.createHttpServer(options);
		const { port, publicUrl, remoteAddr } = this.getServerProperties(server, options);

		await this.createPortFile(options.appletUid, options.appletVersion, port);
		server.listen(port, () => {
			log('info', this.getServerMessage(options.appletUid, options.appletVersion, publicUrl));
		});

		return new AppletServer(
			server,
			port,
			publicUrl,
			remoteAddr,
			() => this.deletePortFile(options.appletUid),
		);
	}

	public async getRunningPort(appletUid: string, appletVersion: string) {
		const portFilePath = this.getRuntimePortFile(appletUid, appletVersion);
		if (await fs.pathExists(portFilePath)) {
			const port = parseInt(await fs.readFile(portFilePath, 'utf8'));
			return port;
		} else {
			return null;
		}
	}

	private async validateRunningServer(appletUid: string, appletVersion: string) {
		const port = await this.getRunningPort(appletUid, appletVersion);
		if (port !== null) {
			if (await this.isPortInUse(appletUid, appletVersion, port)) {
				throw new Error(`Applet server ${appletUid}@${appletVersion} is already running on port ${port}`);
			} else {
				// Only clean up the port file if the port is not in use anymore
				await this.deletePortFile(appletUid);
			}
		}
	}

	private async isPortInUse(appletUid: string, appletVersion: string, port: number) {
		const packagePublicPath = this.getPackagePublicPath(appletUid, appletVersion);
		const request = http.request({ port, method: 'HEAD', path: packagePublicPath });
		const promise = new Promise<boolean>((resolve) => {
			request.on('response', () => resolve(true));
			request.on('error', () => resolve(false));
		});
		request.end();
		return await promise;
	}

	private getServerProperties(server: http.Server, options: IServeOptions) {
		const remoteAddr = getMachineRemoteAddr();
		const address = server.address();
		const port = options.port ?? (address && typeof address === 'object' ? address.port : DEFAULT_SERVER_PORT);
		const publicUrl = options.publicUrl ?? `http://${remoteAddr}:${port}`;

		return {
			port,
			publicUrl,
			remoteAddr,
		};
	}

	private createHttpServer(options: IServeOptions) {
		const packagePublicPath = this.getPackagePublicPath(options.appletUid, options.appletVersion);
		const packageArchivePath = getAppletPackageArchivePath(options.appletUid, options.appletVersion);

		const app = express();
		app.use(cors());
		app.use(this.noCacheMiddleware);
		app.use(packagePublicPath, express.static(packageArchivePath));
		const server = http.createServer(app);

		return server;
	}

	private async createPortFile(appletUid: string, appletVersion: string, serverPort: number) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		await fs.ensureDir(runtimeDir);
		const portFilePath = this.getRuntimePortFile(appletUid, appletVersion);
		await fs.writeFile(portFilePath, serverPort.toString());
	}

	private async deletePortFile(appletUid: string) {
		await fs.remove(this.getAppletRuntimeDir(appletUid));
	}

	private getRuntimePortFile(appletUid: string, appletVersion: string) {
		const runtimeDir = this.getAppletVersionRuntimeDir(appletUid, appletVersion);
		return path.join(runtimeDir, PORT_FILENAME);
	}

	private getAppletVersionRuntimeDir(appletUid: string, appletVersion: string) {
		const tempDir = path.join(this.getAppletRuntimeDir(appletUid), appletVersion);
		return tempDir;
	}

	private getAppletRuntimeDir(appletUid: string) {
		const tempDir = path.join(os.tmpdir(), RUNTIME_DIRNAME, APPLET_SERVERS_DIRENAME, appletUid);
		return tempDir;
	}

	private noCacheMiddleware = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.header('Cache-control', 'no-cache');
		next();
	}

	private getServerMessage(appletUid: string, appletVersion: string, publicUrl: string): string {
		return `Serving applet on ${chalk.blue(chalk.bold(publicUrl))} (${chalk.green(appletUid)}@${chalk.green(appletVersion)})`;
	}

	private getPackagePublicPath(appletUid: string, appletVersion: string) {
		return `/applet/${appletUid}/${appletVersion}-:buildRequestUid/${PACKAGE_ARCHIVE_FILENAME}`;
	}
}
