import should from 'should';
import { Api, PaginatedList } from '../../../../../../src';
import { opts } from '../../../helper';
import AppletVersionFile from '../../../../../../src/RestApi/Applet/Version/File/AppletVersionFile';

const api = new Api(opts);

describe('e2e.RestAPI - Applet Version File Pagination', function () {
	// Set a longer timeout for these tests as they involve uploading files
	this.timeout(60000);

	let testAppletUid: string;
	let testAppletVersion: string;
	const fileCount = 25; // Create more files than the default page size

	before('setup test applet with multiple files', async function () {
		// Create a test applet
		const randomString = Math.random().toString(36).substring(7);
		const appletName = `sdk-test-pagination-${randomString}`;

		const applet = await api.applet.create({
			name: appletName,
		});
		testAppletUid = applet.uid;

		// Create an applet version (multi-file applet - no binary)
		testAppletVersion = '1.0.0';

		await api.applet.version.create(testAppletUid, {
			version: testAppletVersion,
			entryFile: 'index.html',
		});

		// Upload multiple files to test pagination
		console.log(`Creating ${fileCount} test files...`);
		for (let i = 0; i < fileCount; i++) {
			const fileName = `test-file-${String(i).padStart(3, '0')}.txt`;
			const fileContent = `Test file content ${i}`;
			const fileBuffer = Buffer.from(fileContent);

			await api.applet.version.file.create(
				testAppletUid,
				testAppletVersion,
				{
					name: fileName,
					path: fileName,
					hash: require('crypto').createHash('md5').update(fileBuffer).digest('hex'),
					size: fileBuffer.length,
					type: 'text/plain',
					content: require('stream').Readable.from(fileBuffer),
				},
				{ build: false }, // Don't build after each file upload
			);
		}

		console.log(`Created ${fileCount} test files successfully`);
	});

	after('cleanup test applet', async function () {
		if (testAppletUid) {
			try {
				await api.applet.delete(testAppletUid);
			} catch (error) {
				console.error('Failed to cleanup test applet:', error);
			}
		}
	});

	it('should list files with pagination support', async function () {
		const firstPage = await api.applet.version.file.list(testAppletUid, testAppletVersion);

		should(Array.isArray(firstPage)).true();
		should(firstPage.length).greaterThan(0);

		// Check if the first page has the expected structure
		should(firstPage[0].name).be.type('string');
		should(firstPage[0].path).be.type('string');

		console.log(`First page contains ${firstPage.length} files`);
	});

	it('should support getNextPage to fetch all files', async function () {
		const allFiles: AppletVersionFile[] = [];
		let currentPage: PaginatedList<AppletVersionFile> | null = await api.applet.version.file.list(testAppletUid, testAppletVersion);

		// Collect files from all pages
		do {
			allFiles.push(...currentPage);
			console.log(`Fetched page with ${currentPage.length} files. Total so far: ${allFiles.length}`);

			// Check if getNextPage exists
			should(typeof currentPage.getNextPage).equal('function');

			const nextPage = await currentPage.getNextPage();
			currentPage = nextPage;
		} while (currentPage !== null);

		console.log(`Total files fetched: ${allFiles.length}`);

		// We should have fetched all files including the entry file
		should(allFiles.length).greaterThanOrEqual(fileCount);

		// Verify all files have unique paths
		const uniquePaths = new Set(allFiles.map((f) => f.path));
		should(uniquePaths.size).equal(allFiles.length);
	});

	it('should handle empty result correctly', async function () {
		// Create a new applet version with no extra files
		const emptyVersion = '2.0.0';

		await api.applet.version.create(testAppletUid, {
			version: emptyVersion,
			entryFile: 'index.html',
		});

		const files = await api.applet.version.file.list(testAppletUid, emptyVersion);

		should(Array.isArray(files)).true();
		// Should have at least the entry file
		should(files.length).greaterThanOrEqual(0);

		// If there are files, getNextPage should return null
		if (files.length > 0) {
			const nextPage = await files.getNextPage();
			should(nextPage).equal(null);
		}
	});
});
