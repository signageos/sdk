import should from 'should';
import { Api, PaginatedList } from '../../../../../../src';
import { opts } from '../../../helper';
import AppletVersionFile from '../../../../../../src/RestApi/Applet/Version/File/AppletVersionFile';

const api = new Api(opts);

describe('e2e.RestAPI - Applet Version File Pagination (Simple)', function () {
	// Set a longer timeout for these tests as they involve network calls
	this.timeout(60000);

	it('should list files with pagination support for an existing applet', async function () {
		// First, get list of applets
		const applets = await api.applet.list();

		console.log(`Found ${applets.length} applets`);

		if (applets.length === 0) {
			console.log('No applets found, skipping test');
			this.skip();
			return;
		}

		// Get the first applet
		const applet = applets[0];
		console.log(`Testing with applet: ${applet.name} (${applet.uid})`);

		// Get versions for this applet
		const versions = await api.applet.version.list(applet.uid);
		console.log(`Found ${versions.length} versions`);

		if (versions.length === 0) {
			console.log('No versions found, skipping test');
			this.skip();
			return;
		}

		// Get the first version
		const version = versions[0];
		console.log(`Testing with version: ${version.version}`);

		// Now test the file listing with pagination
		const firstPage: PaginatedList<AppletVersionFile> | null = await api.applet.version.file.list(applet.uid, version.version);

		console.log(`First page contains ${firstPage.length} files`);

		should(Array.isArray(firstPage)).true();

		if (firstPage.length > 0) {
			// Check if the first page has the expected structure
			should(firstPage[0].name).be.type('string');
			should(firstPage[0].path).be.type('string');

			console.log(`Sample file: ${firstPage[0].name} at ${firstPage[0].path}`);
		}

		// Check if getNextPage exists
		should(typeof firstPage.getNextPage).equal('function');

		// Try to fetch all pages
		let allFiles: AppletVersionFile[] = [];
		let currentPage: PaginatedList<AppletVersionFile> | null = firstPage;
		let pageCount = 1;

		do {
			allFiles.push(...currentPage);
			console.log(`Page ${pageCount}: ${currentPage.length} files. Total so far: ${allFiles.length}`);

			const nextPage = await currentPage.getNextPage();
			currentPage = nextPage;
			pageCount++;
		} while (currentPage !== null && pageCount < 10); // Limit to 10 pages for safety

		console.log(`Total files fetched across ${pageCount - 1} pages: ${allFiles.length}`);

		// Verify all files have unique paths
		const uniquePaths = new Set(allFiles.map((f) => f.path));
		should(uniquePaths.size).equal(allFiles.length, 'All file paths should be unique');
	});

	it('should handle Link header pagination correctly', async function () {
		// Get list of applets
		const applets = await api.applet.list();

		if (applets.length === 0) {
			console.log('No applets found, skipping test');
			this.skip();
			return;
		}

		// Get the first applet with files
		for (let i = 0; i < Math.min(applets.length, 5); i++) {
			const applet = applets[i];
			const versions = await api.applet.version.list(applet.uid);

			if (versions.length === 0) continue;

			const version = versions[0];
			const files = await api.applet.version.file.list(applet.uid, version.version);

			console.log(`Applet ${applet.name} v${version.version} has ${files.length} files on first page`);

			if (files.length > 0) {
				// Found an applet with files
				console.log(`Testing pagination with applet: ${applet.name} (${applet.uid})`);

				// Test that we can call getNextPage
				const nextPage = await files.getNextPage();

				if (nextPage === null) {
					console.log('Only one page of results');
				} else {
					console.log(`Second page contains ${nextPage.length} files`);
					should(Array.isArray(nextPage)).true();
				}

				return;
			}
		}

		console.log('Could not find an applet with files to test');
		this.skip();
	});
});
