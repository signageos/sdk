import * as should from 'should';
import * as path from 'path';
import * as fs from 'fs-extra';
import waitUntil from '../../../../src/Timer/waitUntil';
import { AppletWatchManagement } from '../../../../src/Development/Applet/Watch/AppletWatchManagement';
import { AppletFilesManagement } from '../../../../src/Development/Applet/Files/AppletFilesManagement';
import { AppletWatcher } from '../../../../src/Development/Applet/Watch/AppletWatcher';

describe('Development.Applet.AppletWatchManagement', function () {

	let watcher: AppletWatcher | null = null;

	const appletFilesManagement = new AppletFilesManagement();
	const appletWatchManagement = new AppletWatchManagement(appletFilesManagement);

	const fixturesDirename = path.normalize(__dirname + '/../fixtures');
	const applet1Dirname = path.join(fixturesDirename, 'applet-1');

	beforeEach(async function () {
		watcher = null;
		await fs.remove(path.join(applet1Dirname, 'dir-1', 'file-X'));
	});

	afterEach(async function () {
		await watcher?.close();
		await fs.remove(path.join(applet1Dirname, 'dir-1', 'file-X'));
	});

	describe('watch', function () {
		this.timeout(4e3);

		it('should watch all included applet files', async function () {
			watcher = await appletWatchManagement.watch({
				appletPath: applet1Dirname,
			});

			const editedFilePaths: string[] = [];

			watcher.onEdit((filePaths) => {
				editedFilePaths.push(...filePaths);
			});

			// initial
			await waitUntil(async () => editedFilePaths.length === 3);
			should(editedFilePaths).eql([
				'file-1',
				'dir-1/file-2',
				'dir-1/dir-2/file-3',
			]);

			await fs.writeFile(path.join(applet1Dirname, 'dir-1', 'file-X'), 'test-1');
			await waitUntil(async () => editedFilePaths.length === 4);
			should(editedFilePaths).eql([
				'file-1',
				'dir-1/file-2',
				'dir-1/dir-2/file-3',
				'dir-1/file-X',
			]);
		});
	});
});
