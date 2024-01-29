import * as should from 'should';
import * as path from 'path';
import * as os from 'os';
import * as extract from 'extract-zip';
import * as fs from 'fs-extra';
import AppletManagementRestApi from '../../../../src/RestApi/Applet/AppletManagement';
import { AppletManagement } from '../../../../src/Development/Applet/AppletManagement';
import { DeviceConnectManagement } from '../../../../src/Development/Device/DeviceConnectManagement';
import RestApi from '../../../../src/RestApi/RestApi';
import IApplet from '../../../../src/RestApi/Applet/IApplet';
import { AppletHotReload } from '../../../../src/Development/Applet/AppletHotReload';
import waitUntil from '../../../../src/Timer/waitUntil';

describe('Development.Applet.AppletManagement', function () {
	let deviceUids: string[] = [];
	let applets: IApplet[] = [];
	let reloadsCount: number = 0;
	let hotReload: AppletHotReload | null = null;

	const restApiV1 = {
		applet: {
			async list() {
				return applets;
			},
		} as Partial<AppletManagementRestApi>,
	} as RestApi;
	const deviceConnectManagement = {
		async reloadConnected() {
			reloadsCount++;
			return { deviceUids };
		},
	} as Partial<DeviceConnectManagement> as DeviceConnectManagement;
	const appletManagement = new AppletManagement(restApiV1, deviceConnectManagement);

	const targetDir = path.join(os.tmpdir(), `extracted_${Date.now()}`);
	const fixturesDirename = path.normalize(__dirname + '/../fixtures');
	const applet1Dirname = path.join(fixturesDirename, 'applet-1');

	before(function () {
		// In tests the typescript is not compiled and the AppletServerProcess is running as separate process.
		process.env.SOS_DEVELOPMENT_APPLET_SERVE_EXEC_ARGV = '-r ts-node/register';
	});

	after(function () {
		delete process.env.SOS_DEVELOPMENT_APPLET_SERVE_EXEC_ARGV;
	});

	beforeEach(async function () {
		deviceUids = [];
		applets = [];
		reloadsCount = 0;
		hotReload = null;
		await fs.remove(targetDir);
		await fs.remove(path.join(applet1Dirname, 'dir-1', 'file-X'));
	});

	afterEach(async function () {
		await hotReload?.stop();
		await fs.remove(path.join(applet1Dirname, 'dir-1', 'file-X'));
	});

	describe('startHotReload', function () {
		this.timeout(10e3);

		it('should start applet hot reload', async function () {
			const randomPort = 12345;
			applets.push({
				uid: 'applet-1',
				createdAt: new Date(),
				name: 'my-first-applet',
			});
			deviceUids.push('device-1', 'device-2');

			hotReload = await appletManagement.startHotReload({
				appletPath: applet1Dirname,
				port: randomPort,
			});
			await waitUntil(async () => reloadsCount === 1); // Initial build

			const appletBuildsPath = path.join(os.tmpdir(), 'signageos', 'applet_builds');
			const packageArchivePath = path.join(appletBuildsPath, 'applet-1', '1.0.0', '.package.zip');

			// initial build with one fast add file-X
			await fs.writeFile(path.join(applet1Dirname, 'dir-1', 'file-X'), 'test-1');
			await waitUntil(async () => reloadsCount === 2);
			await fs.remove(targetDir);
			await extract(packageArchivePath, { dir: targetDir });

			should(reloadsCount).equal(2);
			should(await fs.readdir(targetDir)).eql(['dir-1', 'file-1', 'package.json']);
			should(await fs.readdir(path.join(targetDir, 'dir-1'))).eql(['dir-2', 'file-2', 'file-X']);
			should(await fs.readdir(path.join(targetDir, 'dir-1', 'dir-2'))).eql(['file-3']);

			// second build with file-X update
			await fs.writeFile(path.join(applet1Dirname, 'dir-1', 'file-X'), 'test-2');
			await waitUntil(async () => reloadsCount === 3);
			await fs.remove(targetDir);
			await extract(packageArchivePath, { dir: targetDir });

			should(reloadsCount).equal(3);
			should(await fs.readdir(targetDir)).eql(['dir-1', 'file-1', 'package.json']);
			should(await fs.readdir(path.join(targetDir, 'dir-1'))).eql(['dir-2', 'file-2', 'file-X']);
			should(await fs.readdir(path.join(targetDir, 'dir-1', 'dir-2'))).eql(['file-3']);

			// third build with file-X remove
			await fs.remove(path.join(applet1Dirname, 'dir-1', 'file-X'));
			await waitUntil(async () => reloadsCount === 4);
			await fs.remove(targetDir);
			await extract(packageArchivePath, { dir: targetDir });

			should(reloadsCount).equal(4);
			should(await fs.readdir(targetDir)).eql(['dir-1', 'file-1', 'package.json']);
			should(await fs.readdir(path.join(targetDir, 'dir-1'))).eql(['dir-2', 'file-2']);
			should(await fs.readdir(path.join(targetDir, 'dir-1', 'dir-2'))).eql(['file-3']);
		});
	});
});
