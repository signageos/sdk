import * as should from 'should';
import * as http from 'http';
import * as express from 'express';
import { Paginator } from '../../../../src/Lib/Pagination/paginator';
import IOptions from '../../../../src/RestApi/IOptions';
import { ApiVersions } from '../../../../src/RestApi/apiVersions';
import { getResource } from '../../../../src/RestApi/requester';

describe('Lib.Pagination.Paginator', function () {
	describe('getPaginatedListFromResponse', function () {
		class DataWrapper {
			constructor(public readonly data: unknown) {}
		}

		const TEST_PORT = 12345;
		const restOptions: IOptions = {
			auth: {
				clientId: 'test',
				secret: 'test',
			},
			clientVersions: {},
			url: `http://localhost:${TEST_PORT}`,
			version: ApiVersions.V1,
		};
		const paginator = new Paginator(restOptions);
		const testCreateEntity = (data: unknown) => new DataWrapper(data);

		const PAGE_1_ITEMS = [{ id: 1 }, { id: 2 }];
		const PAGE_2_ITEMS = [{ id: 3 }, { id: 4 }];
		const PAGE_3_ITEMS = [{ id: 5 }, { id: 6 }];
		const pages = [PAGE_1_ITEMS, PAGE_2_ITEMS, PAGE_3_ITEMS];

		let server: http.Server;

		before('start http server', function (done) {
			const app = express();
			app.get(`/${ApiVersions.V1}/resource-single-page`, (_req, res) => {
				res.writeHead(200, {
					'Content-Type': 'application/json',
				});
				res.end(JSON.stringify(PAGE_1_ITEMS));
			});
			app.get(`/${ApiVersions.V1}/resource-multi-page`, (req, res) => {
				const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
				if (page < 3) {
					res.header('Link', `<http://localhost:${TEST_PORT}/${ApiVersions.V1}/resource-multi-page?page=${page + 1}>; rel="next"`);
				}
				res.send(pages[page - 1]);
			});
			server = app.listen(TEST_PORT, done);
		});

		after('stop http server', function (done) {
			server.close(done);
		});

		it('should return paginated list with 3 pages until end of the list', async function () {
			const listPage1Resp = await getResource(restOptions, 'resource-multi-page');
			const listPage1 = await paginator.getPaginatedListFromResponse<DataWrapper>(listPage1Resp, testCreateEntity);
			should([...listPage1]).eql(PAGE_1_ITEMS.map((data) => new DataWrapper(data)));
			const listPage2 = await listPage1.getNextPage();
			should([...listPage2!]).eql(PAGE_2_ITEMS.map((data) => new DataWrapper(data)));
			const listPage3 = await listPage2?.getNextPage();
			should([...listPage3!]).eql(PAGE_3_ITEMS.map((data) => new DataWrapper(data)));
			const listPage4 = await listPage3?.getNextPage();
			should(listPage4).null();
		});

		it('should not return next page when no Link header', async function () {
			const listPage1Resp = await getResource(restOptions, 'resource-single-page');
			const paginatedList = await paginator.getPaginatedListFromResponse<DataWrapper>(listPage1Resp, testCreateEntity);
			should([...paginatedList]).eql(PAGE_1_ITEMS.map((data) => new DataWrapper(data)));
			const nextPage = await paginatedList.getNextPage();
			should(nextPage).null();
		});
	});
});
