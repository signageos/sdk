import * as should from 'should';
import * as sinon from 'sinon';
import { Response } from 'node-fetch';
import { doRequest } from '../../../src/RestApi/requester';
import GatewayError from '../../../src/RestApi/Error/GatewayError';
import NotFoundError from '../../../src/RestApi/Error/NotFoundError';

const wait = (_: number) => Promise.resolve();

const mockResponse = {
	headers: {
		get: () => null,
	},
} as unknown as Response;

describe('requester', function () {
	it('should fail on bad gateway', async function () {
		const doFetch = async (_: string) => {
			throw new GatewayError(502, 'Bad Gateway');
		};
		const spiedWait = sinon.spy(wait);
		await should(
			doRequest({
				url: 'url',
				fetchFn: doFetch,
				waitFn: spiedWait,
			}),
		).rejectedWith(GatewayError);
		should(spiedWait.callCount).equal(3);
	});

	it('should fail on not found', async function () {
		const doFetch = async (_: string) => {
			throw new NotFoundError(404, 'Not Found');
		};
		const spiedWait = sinon.spy(wait);
		await should(
			doRequest({
				url: 'url',
				fetchFn: doFetch,
				waitFn: spiedWait,
			}),
		).rejectedWith(NotFoundError);
		should(spiedWait.notCalled).equal(true);
	});

	it('should return valid response', async function () {
		const doFetch = async (_: string) => mockResponse;
		await should(
			doRequest({
				url: 'url',
				fetchFn: doFetch,
				waitFn: wait,
			}),
		).fulfilledWith(mockResponse);
	});
});
