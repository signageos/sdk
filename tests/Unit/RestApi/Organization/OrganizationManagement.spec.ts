import * as should from 'should';
import * as nock from 'nock';
import {nockOpts} from '../helper';
import IOrganization, {IOrganizationCreatable} from '../../../../src/RestApi/Organization/IOrganization';
import OrganizationManagement from "../../../../src/RestApi/Organization/OrganizationManagement";

describe('OrganizationManagement', () => {

	const organization: IOrganization = {
		'uid': 'someUid',
		'name': 'signageos',
		'title': 'signageOS.io',
		'oauthClientId': '12a15XXX612d',
		'oauthClientSecret': '2e2201XXX77745',
		'createdAt': new Date('2017-05-24T08:56:52.550Z'),
	};

	const validGetResp: IOrganization = organization;
	const validListResp: IOrganization[] = [organization];
	const validCreateReq: IOrganizationCreatable = {
		name: 'SOS',
		title: 'signageOS.io organization',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/organization').reply(200, validListResp)
		.get('/v1/organization/someUid').reply(200, validGetResp)
		.get('/v1/organization/someUid?name=signageos').reply(200, validGetResp)
		.post('/v1/organization', validCreateReq).reply(200, 'Created')
		.put('/v1/organization/someUid/subscriptionType/medium').reply(200, '');

	const om = new OrganizationManagement(nockOpts);
	const assertOrg = (org: IOrganization) => {
		should.equal(validGetResp.uid, org.uid);
		should.equal(validGetResp.name, org.name);
		should.equal(validGetResp.title, org.title);
		should.equal(validGetResp.oauthClientId, org.oauthClientId);
		should.equal(validGetResp.oauthClientSecret, org.oauthClientSecret);
		should.deepEqual(validGetResp.createdAt, org.createdAt);
	};

	it('should get the organization list', async () => {
		const orgs = await om.list();
		should.equal(1, orgs.length);
		assertOrg(orgs[0]);
	});

	it('should get the single organization', async () => {
		const org = await om.get('someUid');
		assertOrg(org);
	});

	it('should get the organization with filter', async () => {
		const org = await om.get('someUid', {name : 'signageos'});
		assertOrg(org);
	});

	it('should create new organization', async () => {
		await om.create(validCreateReq);
		should(true).true();
	});

	it('should set subscription type', async () => {
		await om.setSubscriptionType('someUid', 'medium');
		should(true).true();
	});
});
