import * as should from 'should';
import * as path from 'path';
import * as fs from 'fs-extra';
import { AppletFilesManagement } from '../../../../src/Development/Applet/Files/AppletFilesManagement';

describe('Development.Applet.AppletFilesManagement', function () {
	const appletFilesManagement = new AppletFilesManagement();

	describe('listAppletFiles', function () {
		const fixturesDirename = path.normalize(__dirname + '/../fixtures');
		const applet1Dirname = path.join(fixturesDirename, 'applet-1');
		const applet2Dirname = path.join(fixturesDirename, 'applet-2');
		const applet3Dirname = path.join(fixturesDirename, 'applet-3');
		const applet4Dirname = path.join(fixturesDirename, 'applet-4');
		const allAppletDirnames = [applet1Dirname, applet2Dirname, applet3Dirname, applet4Dirname];

		before(async function () {
			// create because git in this repo ignores it
			for (const appletDirname of allAppletDirnames) {
				await fs.ensureDir(path.join(appletDirname, '.git'));
				await fs.writeFile(path.join(appletDirname, '.git', 'git-file'), '');
			}
			await fs.ensureDir(path.join(applet3Dirname, 'dir-2'));
			await fs.writeFile(path.join(applet3Dirname, 'dir-2', 'file-1'), '');
			await fs.ensureDir(path.join(applet3Dirname, 'dir-1', 'dir-2'));
			await fs.writeFile(path.join(applet3Dirname, 'dir-1', 'dir-2', 'file-3'), '');
		});

		beforeEach(async function () {
			await fs.remove(path.join(applet1Dirname, 'dir-1', 'file-X'));
		});

		it('should list all files in package.json "files"', async function () {
			const filePaths = await appletFilesManagement.listAppletFiles({
				appletPath: applet1Dirname,
			});
			should(filePaths).eql(
				['package.json', 'file-1', 'dir-1/file-2', 'dir-1/dir-2/file-3'].map((filePath) => path.join(applet1Dirname, filePath)),
			);
		});

		it('should list all files not in .sosignore', async function () {
			const filePaths = await appletFilesManagement.listAppletFiles({
				appletPath: applet2Dirname,
			});
			should(filePaths).eql(
				['package.json', '.sosignore', 'file-1', 'dir-1/file-2', 'dir-1/dir-2/file-3'].map((filePath) =>
					path.join(applet2Dirname, filePath),
				),
			);
		});

		it('should list all files not in .gitignore', async function () {
			const filePaths = await appletFilesManagement.listAppletFiles({
				appletPath: applet3Dirname,
			});
			should(filePaths).eql(
				['package.json', '.gitignore', 'file-1', 'dir-1/file-2', 'dir-1/dir-2/file-3'].map((filePath) =>
					path.join(applet3Dirname, filePath),
				),
			);
		});

		it('should list all files not in .npmignore', async function () {
			const filePaths = await appletFilesManagement.listAppletFiles({
				appletPath: applet4Dirname,
			});
			should(filePaths).eql(
				['package.json', '.npmignore', 'file-1', '.git/git-file', 'dir-1/file-2', 'dir-1/dir-2/file-3'].map((filePath) =>
					path.join(applet4Dirname, filePath),
				),
			);
		});
	});
});
