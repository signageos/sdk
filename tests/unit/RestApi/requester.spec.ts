import should from 'should';
import * as sinon from 'sinon';
import nock from 'nock';
import { Response } from 'node-fetch';
import { doRequest, getResource, postResource } from '../../../src/RestApi/requester';
import GatewayError from '../../../src/RestApi/Error/GatewayError';
import NotFoundError from '../../../src/RestApi/Error/NotFoundError';
import IOptions from '../../../src/RestApi/IOptions';
import { ApiVersions } from '../../../src/RestApi/apiVersions';

const wait = (_: number) => Promise.resolve();

const mockResponse = {
	headers: {
		get: () => null,
	},
} as unknown as Response;

describe('requester', function () {
	it('should fail on bad gateway', async function () {
		const doFetch = async (_: unknown) => {
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
		const doFetch = async (_: unknown) => {
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
		const doFetch = async (_: unknown) => mockResponse;
		await should(
			doRequest({
				url: 'url',
				fetchFn: doFetch,
				waitFn: wait,
			}),
		).fulfilledWith(mockResponse);
	});

	describe('X-Auth header', function () {
		afterEach(function () {
			nock.cleanAll();
		});

		const BASE_URL = 'https://api.test.signageos.io';

		it('should send clientId:secret in X-Auth header for legacy auth', async function () {
			const options: IOptions = {
				url: BASE_URL,
				auth: { clientId: 'myClientId', secret: 'mySecret' },
				version: ApiVersions.V1,
				clientVersions: {},
			};

			const scope = nock(BASE_URL, {
				reqheaders: {
					'x-auth': 'myClientId:mySecret',
				},
			})
				.get('/v1/test-resource')
				.reply(200, { ok: true });

			await getResource(options, 'test-resource');
			should(scope.isDone()).equal(true);
		});

		it('should send access token in X-Auth header for JWT auth', async function () {
			const jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.test-payload.test-signature';
			const options: IOptions = {
				url: BASE_URL,
				auth: { accessToken: jwtToken },
				version: ApiVersions.V1,
				clientVersions: {},
			};

			const scope = nock(BASE_URL, {
				reqheaders: {
					'x-auth': jwtToken,
				},
			})
				.get('/v1/test-resource')
				.reply(200, { ok: true });

			await getResource(options, 'test-resource');
			should(scope.isDone()).equal(true);
		});

		it('should send access token in X-Auth header when auth is a function returning JWT options', async function () {
			const jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.async-payload.async-signature';
			const options: IOptions = {
				url: BASE_URL,
				auth: async () => ({ accessToken: jwtToken }),
				version: ApiVersions.V1,
				clientVersions: {},
			};

			const scope = nock(BASE_URL, {
				reqheaders: {
					'x-auth': jwtToken,
				},
			})
				.post('/v1/test-resource')
				.reply(201, { created: true });

			await postResource(options, 'test-resource', JSON.stringify({ name: 'test' }));
			should(scope.isDone()).equal(true);
		});

		it('should send clientId:secret in X-Auth header when auth is a function returning legacy options', async function () {
			const options: IOptions = {
				url: BASE_URL,
				auth: async () => ({ clientId: 'asyncClient', secret: 'asyncSecret' }),
				version: ApiVersions.V1,
				clientVersions: {},
			};

			const scope = nock(BASE_URL, {
				reqheaders: {
					'x-auth': 'asyncClient:asyncSecret',
				},
			})
				.get('/v1/test-resource')
				.reply(200, { ok: true });

			await getResource(options, 'test-resource');
			should(scope.isDone()).equal(true);
		});
	});
});
