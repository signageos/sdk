import * as should from 'should';
import { Headers, Response } from 'node-fetch';
import { getNextPageLink } from '../../../../src/Lib/Pagination/paginationLinkParser';

describe('Lib.Pagination.paginationLinkParser', function () {
	describe('getNextPageLink', function () {
		it('should return null if there is no link header', function () {
			const testResp = {
				headers: new Headers({}),
			} as Response;
			should(getNextPageLink(testResp)).null();
		});

		it('should return url from link header', function () {
			const testResp = {
				headers: new Headers({
					Link: '<https://api.github.com/repositories/1300192/issues?page=4>; rel="next"',
				}),
			} as Response;
			should(getNextPageLink(testResp)).eql({
				url: 'https://api.github.com/repositories/1300192/issues?page=4',
			});
		});

		it('should return next url from link header if there are more links', function () {
			const testResp = {
				headers: new Headers({
					Link: '<https://api.github.com/repositories/1300192/issues?page=2>; rel="prev", <https://api.github.com/repositories/1300192/issues?page=4>; rel="next", <https://api.github.com/repositories/1300192/issues?page=515>; rel="last", <https://api.github.com/repositories/1300192/issues?page=1>; rel="first"',
				}),
			} as Response;
			should(getNextPageLink(testResp)).eql({
				url: 'https://api.github.com/repositories/1300192/issues?page=4',
			});
		});
	});
});
