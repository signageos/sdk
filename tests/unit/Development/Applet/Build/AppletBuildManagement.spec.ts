import should from 'should';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import sinon from 'sinon';
import { AppletBuildManagement } from '../../../../../src/Development/Applet/Build/AppletBuildManagement';
import { getAppletPackageArchivePath } from '../../../../../src/Development/runtimeFileSystem';

describe('Development.Applet.Build.AppletBuildManagement', function () {
	let tmpDir: string;

	beforeEach(async function () {
		tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sdk-test-build-'));
	});

	afterEach(async function () {
		await fs.remove(tmpDir);
	});

	describe('build', function () {
		const appletUid = 'test-applet-uid';
		const appletVersion = '1.0.0';

		function createBuildManagement() {
			const filesManagement = {
				listAppletFiles: sinon.stub().resolves([]),
			} as any;
			return new AppletBuildManagement(filesManagement);
		}

		it('should create package archive in build directory', async function () {
			const appletPath = path.join(tmpDir, 'applet');
			await fs.ensureDir(appletPath);

			const buildManagement = createBuildManagement();
			const build = await buildManagement.build({
				appletPath,
				appletUid,
				appletVersion,
			});

			const archivePath = getAppletPackageArchivePath(appletUid, appletVersion);
			const exists = await fs.pathExists(archivePath);
			should(exists).be.true();

			await build.clean();
		});
	});
});
