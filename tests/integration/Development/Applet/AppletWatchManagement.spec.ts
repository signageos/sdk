import should from 'should';
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
		this.timeout(12e3);

		it('should watch all included applet files', async function () {
			watcher = await appletWatchManagement.watch({
				appletPath: applet1Dirname,
			});

			const editedFilePaths: string[] = [];

			watcher.onEdit((filePaths) => {
				editedFilePaths.push(...filePaths);
			});

			await fs.writeFile(path.join(applet1Dirname, 'dir-1', 'file-X'), 'test-1');
			await waitUntil(async () => editedFilePaths.length === 1);
			should(editedFilePaths).eql(['dir-1/file-X']);
		});

		it('should watch all included applet files without initial because it was emitted before the watcher returned', async function () {
			watcher = await appletWatchManagement.watch({
				appletPath: applet1Dirname,
				chokidarOptions: {
					ignoreInitial: false,
				},
			});

			const editedFilePaths: string[] = [];

			watcher.onEdit((filePaths) => {
				editedFilePaths.push(...filePaths);
			});

			// initial
			await waitUntil(async () => editedFilePaths.length === 0);
			should(editedFilePaths).eql([]);

			await fs.writeFile(path.join(applet1Dirname, 'dir-1', 'file-X'), 'test-1');
			await waitUntil(async () => editedFilePaths.length === 1);
			should(editedFilePaths).eql(['dir-1/file-X']);
		});
	});
});
