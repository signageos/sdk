import * as faker from 'faker';
import should from 'should';
import { Api } from '../../../../src';
import IOrganization from '../../../../src/RestApi/Organization/IOrganization';
import Organization from '../../../../src/RestApi/Organization/Organization';
import { opts } from '../helper';

const api = new Api(opts);

describe('e2e.RestAPI - Organization', () => {
	const assertOrg = (org: IOrganization) => {
		should(org instanceof Organization).true();
		should(org.name.length).aboveOrEqual(0, 'organization name should never be empty');
		should(org.title.length).aboveOrEqual(0, 'organization title should never be empty');
		should(org.createdAt.getTime()).aboveOrEqual(0, 'organization createdAt should be real date');
		should(org.oauthClientId.length).aboveOrEqual(0, 'organization oauthClientId should never be empty');
		should(org.oauthClientSecret.length).aboveOrEqual(0, 'organization oauthClientSecret should never be empty');
	};

	const toDelete: Organization[] = [];
	after(async () => {
		for (const org of toDelete) {
			await api.organization.delete(org.uid);
		}
	});

	it('should create the new organization', async () => {
		const org = await api.organization.create({
			name: getOrgName(),
			title: getOrgTitle(),
		});
		toDelete.push(org);

		should(true).true();
	});

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
	});

	it('should get the organizations by Uid', async () => {
		const createdOrg = await api.organization.create({
			name: getOrgName(),
			title: getOrgTitle(),
		});
		toDelete.push(createdOrg);

		const orgGetFromDb = await api.organization.get(createdOrg.uid);
		assertOrg(orgGetFromDb);
		should.deepEqual(createdOrg, orgGetFromDb, 'inconsistency in organizations data');
	});

	it('should delete the organizations by Uid', async () => {
		let org = await api.organization.create({
			name: getOrgName(),
			title: getOrgTitle(),
		});

		await api.organization.delete(org.uid);

		try {
			await api.organization.get(org.uid);
			should(true).eql(false);
		} catch (err: any) {
			should(err.errorName).eql('NO_ORGANIZATION_TO_READ');
			should(err.errorCode).eql(404113);
		}
	});

	it('should update the organization title by Uid', async () => {
		let title = getOrgTitle();

		let org = await api.organization.create({
			name: getOrgName(),
			title,
		});
		toDelete.push(org);

		assertOrg(org);
		should(org.title).eql(title);

		title = 'NewTestingTitle';

		await api.organization.update(org.uid, { title });

		org = await api.organization.get(org.uid);

		assertOrg(org);
		should(org.title).eql(title);
	});
});

const getOrgName = () => `sdk-${faker.commerce.product()}-${faker.random.alphaNumeric(10)}`;
const getOrgTitle = () => `[SDK] - ${faker.company.companyName()}`;
