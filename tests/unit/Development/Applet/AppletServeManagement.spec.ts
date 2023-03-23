import * as should from 'should';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { AppletServeManagement } from '../../../../src/Development/Applet/Serve/AppletServeManagement';
import { getAppletBuildRuntimeDir, getAppletPackageArchivePath, getAppletVersionBuildRuntimeDir } from '../../../../src/Development/runtimeFileSystem';
import { getRequest } from '../../Utils/requestHelper';
import { AppletServer } from '../../../../src/Development/Applet/Serve/AppletServer';

describe('Development.Applet.AppletServeManagement', function () {
	this.timeout(10e3);

	const appletServeManagement = new AppletServeManagement();

	before(function () {
		// In tests the typescript is not compiled and the AppletServerProcess is running as separate process.
		process.env.SOS_DEVELOPMENT_APPLET_SERVE_EXEC_ARGV = '-r ts-node/register';
	});

	after(function () {
		delete process.env.SOS_DEVELOPMENT_APPLET_SERVE_EXEC_ARGV;
	});

	let appletServer1: AppletServer | null = null;
	let appletServer2: AppletServer | null = null;

	beforeEach(async function () {
		await fs.remove(getAppletBuildRuntimeDir('applet-1'));
	});

	afterEach(async function () {
		await appletServer1?.stop();
		await appletServer2?.stop();
		appletServer1 = null;
		appletServer2 = null;
	});

	describe('serve', function () {

		it('should start serving applet files', async function () {
			appletServer1 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});

			should(appletServer1.port).Number();
			should(appletServer1.publicUrl).match(new RegExp(`^http:\\/\\/\\d+\\.\\d+\.\\d+\\.\\d+:${appletServer1.port}$`));
			should(appletServer1.remoteAddr).match(/^\d+\.\d+\.\d+\.\d+$/);

			const appletServersPath = path.join(os.tmpdir(), 'signageos', 'applet_servers');
			const appletServerDirPath = path.join(appletServersPath, 'applet-1', '1.0.0');
			const portFilePath = path.join(appletServerDirPath, 'port');
			const port = await fs.readFile(portFilePath, 'utf8');
			should(port).equal(appletServer1.port.toString());

			const response1 = await getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response1.statusCode).equal(404);
			await fs.ensureDir(getAppletVersionBuildRuntimeDir('applet-1', '1.0.0'));
			await fs.writeFile(getAppletPackageArchivePath('applet-1', '1.0.0'), 'test-1');

			const response2 = await getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response2.statusCode).equal(200);
			should(response2.data).length(6);

			await appletServer1.stop();

			await should(getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip')).rejected();

			should(await fs.pathExists(portFilePath)).equal(false);
			should(await fs.pathExists(appletServerDirPath)).equal(false);
		});

		it('should start more servers with same server process and stop the process when all stopped', async function () {
			appletServer1 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});
			appletServer2 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});

			should(appletServer1.port).equal(appletServer2.port);
			should(appletServer1.remoteAddr).equal(appletServer2.remoteAddr);

			const response1 = await getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response1.statusCode).equal(404);

			await appletServer1.stop();

			const response2 = await getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response2.statusCode).equal(404);

			await appletServer2.stop();

			await should(getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip')).rejected();
		});

		it('should not start other server of same applet and version on different port', async function () {
			appletServer1 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});
			await should(appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
				port: appletServer1.port + 1,
			})).rejectedWith(`Applet server applet-1@1.0.0 is already running on port 8080 so it cannot be started on port 8081`);

			await appletServer1.stop();
		});

		it('should start more servers with different server process for more applet versions', async function () {
			appletServer1 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
				port: 8080,
			});
			appletServer2 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.1',
				port: 8081,
			});

			const response1 = await getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response1.statusCode).equal(404);

			const response2 = await getRequest(appletServer2.port, '/applet/applet-1/1.0.1-xxx/.package.zip');
			should(response2.statusCode).equal(404);

			await appletServer1.stop();
			await should(getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip')).rejected();
			const response3 = await getRequest(appletServer2.port, '/applet/applet-1/1.0.1-xxx/.package.zip');
			should(response3.statusCode).equal(404);

			await appletServer2.stop();
			await should(getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip')).rejected();
			await should(getRequest(appletServer2.port, '/applet/applet-1/1.0.1-xxx/.package.zip')).rejected();
		});

		it('should not start other server of different applet or version on same port', async function () {
			appletServer1 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});
			await should(appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.1',
			})).rejectedWith(`Requested port 8080 is already in use by another process`);

			await appletServer1.stop();
		});
	});

	describe('killRunningServer', function () {

		it('should kill running server', async function () {
			appletServer1 = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});

			const response1 = await getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response1.statusCode).equal(404);

			// We have to remove parents because it would kill test process
			const parentsPath = path.join(os.tmpdir(), 'signageos', 'applet_servers', 'applet-1', '1.0.0', 'parents');
			await fs.remove(parentsPath);

			await appletServeManagement.killRunningServer('applet-1', '1.0.0');

			await should(getRequest(appletServer1.port, '/applet/applet-1/1.0.0-xxx/.package.zip')).rejected();
		});
	});
});
