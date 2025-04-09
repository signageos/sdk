import should from 'should';
import { createApiV1, createApiV2 } from '../../src';
import { ApiVersions } from '../../src/RestApi/apiVersions';

describe('createApiV1', () => {
	it('should create an instance of RestApi', () => {
		const api = createApiV1();
		should(api.accountOptions.version).equal(ApiVersions.V1);
		should(api.organizationOptions.version).equal(ApiVersions.V1);
	});
});

describe('createApiV2', () => {
	it('should create an instance of RestApi', () => {
		const api = createApiV2();
		should(api.accountOptions.version).equal(ApiVersions.V2);
		should(api.organizationOptions.version).equal(ApiVersions.V2);
	});
});
