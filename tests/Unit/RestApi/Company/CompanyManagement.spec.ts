import * as should from 'should';
import * as nock from 'nock';
import {nockOpts} from '../helper';
import IOrganization from '../../../../src/RestApi/Organization/IOrganization';
import CompanyManagement, { ICompany } from '../../../../src/RestApi/Company/CompanyManagement';

describe('CompanyManagement', () => {

	const company: ICompany = {
		'uid': 'someUid',
		'name': 'signageos',
		'title': 'signageOS.io',
		'oauthClientId': '12a15XXX612d',
		'oauthClientSecret': '2e2201XXX77745',
		'createdAt': new Date('2017-05-24T08:56:52.550Z'),
	};

	const validGetResp: IOrganization = company;
	const validListResp: IOrganization[] = [company];

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/company').reply(200, validListResp)
		.get('/v1/company/someUid').reply(200, validGetResp)
		.put('/v1/company/someUid/billingPlan/enterprise').reply(200, '');

	const cm = new CompanyManagement(nockOpts);
	const assertCompany = (org: IOrganization) => {
		should.equal(validGetResp.uid, org.uid);
		should.equal(validGetResp.name, org.name);
		should.equal(validGetResp.title, org.title);
		should.equal(validGetResp.oauthClientId, org.oauthClientId);
		should.equal(validGetResp.oauthClientSecret, org.oauthClientSecret);
		should.deepEqual(validGetResp.createdAt, org.createdAt);
	};

	it('should get the companies list', async () => {
		const companies = await cm.list();
		should.equal(1, companies.length);
		assertCompany(companies[0]);
	});

	it('should get the single organization', async () => {
		const org = await cm.get('someUid');
		assertCompany(org);
	});

	it('should set billing plan', async () => {
		await cm.setBillingPlan('someUid', 'enterprise');
		should(true).true();
	});
});
