import * as should from 'should';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { AppletServeManagement } from '../../../../src/Development/Applet/Serve/AppletServeManagement';
import { getAppletBuildRuntimeDir, getAppletPackageArchivePath, getAppletVersionBuildRuntimeDir } from '../../../../src/Development/runtimeFileSystem';
import { getRequest } from '../../Utils/requestHelper';

describe('Development.Applet.AppletServeManagement', function () {

	const appletServeManagement = new AppletServeManagement();

	describe('serve', function () {
		this.timeout(10e3);

		beforeEach(async function () {
			await fs.remove(getAppletBuildRuntimeDir('applet-1'));
		});

		it('should start serving applet files', async function () {
			const appletServer = await appletServeManagement.serve({
				appletUid: 'applet-1',
				appletVersion: '1.0.0',
			});

			should(appletServer.port).Number();
			should(appletServer.publicUrl).match(new RegExp(`^http:\\/\\/\\d+\\.\\d+\.\\d+\\.\\d+:${appletServer.port}$`));
			should(appletServer.remoteAddr).match(/^\d+\.\d+\.\d+\.\d+$/);

			const appletServersPath = path.join(os.tmpdir(), 'signageos', 'applet_servers');
			const appletServerDirPath = path.join(appletServersPath, 'applet-1', '1.0.0');
			const portFilePath = path.join(appletServerDirPath, 'port');
			const port = await fs.readFile(portFilePath, 'utf8');
			should(port).equal(appletServer.port.toString());

			const response1 = await getRequest(appletServer.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response1.statusCode).equal(404);
			await fs.ensureDir(getAppletVersionBuildRuntimeDir('applet-1', '1.0.0'));
			await fs.writeFile(getAppletPackageArchivePath('applet-1', '1.0.0'), 'test-1');

			const response2 = await getRequest(appletServer.port, '/applet/applet-1/1.0.0-xxx/.package.zip');
			should(response2.statusCode).equal(200);
			should(response2.data).length(6);

			await appletServer.stop();

			await should(getRequest(appletServer.port, '/applet/applet-1/1.0.0-xxx/.package.zip')).rejected();

			should(await fs.pathExists(portFilePath)).equal(false);
			should(await fs.pathExists(appletServerDirPath)).equal(false);
		});
	});
});
