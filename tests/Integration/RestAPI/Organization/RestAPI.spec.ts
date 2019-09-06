import * as should from 'should';
import RestApi from "../../../../src/RestApi/RestApi";
import IOrganization from "../../../../src/RestApi/Organization/IOrganization";
import Organization from "../../../../src/RestApi/Organization/Organization";
import {accountOpts, opts} from "../helper";

const allowedTimeout = 10000;
const api = new RestApi(opts, accountOpts);

describe('RestAPI - Organization', () => {

	before(function () {
		// in order to run these tests, fill in to mandatory ENV variables (please see ../helper file)
		if (accountOpts.auth.clientId === '' || accountOpts.auth.secret === '') {
			this.test.skip('you must set account auth details in order to run this test');
		}
	});

	const assertOrg = (org: IOrganization) => {
		should(org instanceof Organization).true();
		should(org.uid).lengthOf(50, 'organization uid should consist of 50 characters');
		should(org.name.length).aboveOrEqual(0, 'organization name should never be empty');
		should(org.title.length).aboveOrEqual(0, 'organization title should never be empty');
		should(org.createdAt.getTime()).aboveOrEqual(0, 'organization createdAt should be real date');
		should(org.oauthClientId.length).aboveOrEqual(0, 'organization oauthClientId should never be empty');
		should(org.oauthClientSecret.length).aboveOrEqual(0, 'organization oauthClientSecret should never be empty');
	};

	let pickedOrg: IOrganization;

	it('should create the new organization', async () => {
		const now = new Date();
		await api.organization.create({
			name: `SDK${now.getTime()}`,
			title: `Integration test organization created on ${now.toISOString()}`
		});
		should(true).true();
	}).timeout(allowedTimeout);

	it('should get the list of existing organizations', async () => {
		const orgs = await api.organization.list({});
		should(Array.isArray(orgs)).true();
		orgs.forEach((org: IOrganization) => {
			assertOrg(org);
			pickedOrg = org;
		});

		if (orgs.length > 0) {
			// test
			const org = await api.organization.get(orgs[0].uid);
			assertOrg(org);
		}
	}).timeout(allowedTimeout);

	it('should get the organizations by Uid', async () => {
		if (!pickedOrg) { // there is no organization, we can't test getting by Uid
			should(true).true();
			return;
		}

		const org = await api.organization.get(pickedOrg.uid);
		assertOrg(org);
		should.deepEqual(pickedOrg, org, 'inconsistency in organizations data');

	}).timeout(allowedTimeout);

});
