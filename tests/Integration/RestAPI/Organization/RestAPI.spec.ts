import * as should from 'should';

import { Api } from "../../../../src";
import IOrganization from "../../../../src/RestApi/Organization/IOrganization";
import Organization from "../../../../src/RestApi/Organization/Organization";
import { opts, ALLOWED_TIMEOUT, preRunCheck } from "../helper";

const api = new Api(opts);

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

describe('RestAPI - Organization', () => {

	before(function () {
		preRunCheck(this.skip.bind(this));
	});

	const assertOrg = (org: IOrganization) => {
		should(org instanceof Organization).true();
		should(org.name.length).aboveOrEqual(0, 'organization name should never be empty');
		should(org.title.length).aboveOrEqual(0, 'organization title should never be empty');
		should(org.createdAt.getTime()).aboveOrEqual(0, 'organization createdAt should be real date');
		should(org.oauthClientId.length).aboveOrEqual(0, 'organization oauthClientId should never be empty');
		should(org.oauthClientSecret.length).aboveOrEqual(0, 'organization oauthClientSecret should never be empty');
	};

	it('should create the new organization', async () => {
		const now = new Date();
		await api.organization.create({
			name: `SDK${now.getTime()}`,
			title: `Integration test organization created on ${now.toISOString()}`,
		});
		should(true).true();
	}).timeout(ALLOWED_TIMEOUT);

	it('should get the list of existing organizations', async () => {
		const orgs = await api.organization.list({});
		should(Array.isArray(orgs)).true();
		orgs.forEach((org: IOrganization) => {
			assertOrg(org);
		});

		if (orgs.length > 0) {
			// test
			const org = await api.organization.get(orgs[0].uid);
			assertOrg(org);
		}
	}).timeout(ALLOWED_TIMEOUT);

	it('should get the organizations by Uid', async () => {
		const createdOrg = await api.organization.create({
			name: `TestingName${getRandomInt(10000)}`,
			title: `TestingTitle${getRandomInt(10000)}`,
		});

		const orgGetFromDb = await api.organization.get(createdOrg.uid);
		assertOrg(orgGetFromDb);
		should.deepEqual(createdOrg, orgGetFromDb, 'inconsistency in organizations data');

	}).timeout(ALLOWED_TIMEOUT);

	it('should delete the organizations by Uid', async () => {
		let org = await api.organization.create({
			name: `TestingName${getRandomInt(10000)}`,
			title: `TestingTitle${getRandomInt(10000)}`,
		});

		await api.organization.delete(org.uid);

		try {
			await api.organization.get(org.uid);
		} catch (err) {
			should(err.errorName).eql('NO_ORGANIZATION_TO_READ');
			should(err.errorCode).eql(404113);
		}

	}).timeout(ALLOWED_TIMEOUT);

	it('should update the organization title by Uid', async () => {
		let title = `TestingTitle${getRandomInt(10000)}`;
		let org = await api.organization.create({
			name: `TestingName${getRandomInt(10000)}`,
			title,
		});

		assertOrg(org);
		should(org.title).eql(title);

		title = 'NewTestingTitle';

		await api.organization.update(org.uid, title);

		org = await api.organization.get(org.uid);

		assertOrg(org);
		should(org.title).eql(title);
	}).timeout(ALLOWED_TIMEOUT);
});
