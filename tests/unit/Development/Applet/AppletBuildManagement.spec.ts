import * as should from 'should';
import * as path from 'path';
import * as os from 'os';
import * as extract from 'extract-zip';
import * as fs from 'fs-extra';
import { AppletBuildManagement } from "../../../../src/Development/Applet/Build/AppletBuildManagement";
import { AppletFilesManagement } from '../../../../src/Development/Applet/Files/AppletFilesManagement';

describe('Development.Applet.AppletBuildManagement', function () {

	const appletFilesManagement = new AppletFilesManagement();
	const appletBuildManagement = new AppletBuildManagement(appletFilesManagement);

	describe('build', function () {

		const targetDir = path.join(os.tmpdir(), `extracted_${Date.now()}`);
		const fixturesDirename = path.normalize(__dirname + '/../fixtures');
		const applet1Dirname = path.join(fixturesDirename, 'applet-1');

		beforeEach(async function () {
			fs.remove(targetDir);
			fs.ensureDir(targetDir);
		});

		it('should build applet files into single .package.zip archive', async function () {
			const appletBuild = await appletBuildManagement.build({
				appletPath: applet1Dirname,
				appletUid: 'applet-1',
				appletVersion: '1.0.0',

			});

			const appletBuildsPath = path.join(os.tmpdir(), 'signageos', 'applet_builds');
			const packageArchivePath = path.join(appletBuildsPath, 'applet-1', '1.0.0', '.package.zip');
			await extract(packageArchivePath, { dir: targetDir });

			should(await fs.readdir(targetDir)).eql([
				'dir-1',
				'file-1',
				'package.json',
			]);
			should(await fs.readdir(path.join(targetDir, 'dir-1'))).eql([
				'dir-2',
				'file-2',
			]);
			should(await fs.readdir(path.join(targetDir, 'dir-1', 'dir-2'))).eql([
				'file-3',
			]);

			should(appletBuild.appletUid).equal('applet-1');
			should(appletBuild.appletVersion).equal('1.0.0');
			should(appletBuild.packageArchivePath).equal(packageArchivePath);
			should(appletBuild.filePaths).eql([
				'package.json',
				'file-1',
				'dir-1/file-2',
				'dir-1/dir-2/file-3',
			].map((filePath) => path.join(applet1Dirname, filePath)));

			await appletBuild.clean();

			should(await fs.readdir(appletBuildsPath)).eql([]);
		});
	});
});
