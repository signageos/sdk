import * as should from 'should';
import * as sinon from 'sinon';
import { Response } from 'node-fetch';
import { doRequest } from '../../../src/RestApi/requester';
import GatewayError from '../../../src/RestApi/Error/GatewayError';
import NotFoundError from '../../../src/RestApi/Error/NotFoundError';

const wait = (_: number) => Promise.resolve();

describe('requester', function () {

	it('should fail on bad gateway', async function () {
		const doFetch = async (_: string) => {
			throw new GatewayError(502, 'Bad Gateway');
		};
		const spiedWait = sinon.spy(wait);
		await should(doRequest(doFetch, spiedWait, 'url')).rejectedWith(GatewayError);
		should(spiedWait.calledOnce).equal(true);
	});

	it('should fail on not found', async function () {
		const doFetch = async (_: string) => {
			throw new NotFoundError(404, 'Not Found');
		};
		const spiedWait = sinon.spy(wait);
		await should(doRequest(doFetch, spiedWait, 'url')).rejectedWith(NotFoundError);
		should(spiedWait.notCalled).equal(true);
	});

	it('should return valid response', async function () {
		const response = {} as Response;
		const doFetch = async (_: string) => response;
		await should(doRequest(doFetch, wait, 'url')).fulfilledWith(response);
	});
});
