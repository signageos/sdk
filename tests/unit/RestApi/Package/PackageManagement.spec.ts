import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, nockAuthHeader1, successRes } from '../helper';
import PackageManagement from '../../../../src/RestApi/Package/PackageManagement';
import Package from '../../../../src/RestApi/Package/Package';

const nockOpts = getNockOpts({});
const API_PREFIX = 'v1';

describe('PackageManagement', () => {
	const getLocationHeader = (packageUid: string): nock.ReplyHeaders => ({
		Location: `${nockOpts.url}/${nockOpts.version}/${PackageManagement.RESOURCE}/${packageUid}`,
	});

	const packageDb = new Package({
		uid: '820c97930a7553d4a9980d92bde38a03114b79fa73b8ded2e0',
		packageName: 'signageos-management',
		createdAt: new Date(),
		label: 'signageOS Management',
		description: 'signageOS Management',
		ownerOrganizationUid: '43259e30b1423d4171e348d6a1a1222e3b0075c8d7ebac868a',
		createdByAccountId: 7234594129157088.0,
	});

	const packageRequestCreate = {
		packageName: 'signageos-management',
		label: 'signageOS Management',
		description: 'signageOS Management',
	};

	nock(nockOpts.url, nockAuthHeader1)
		.persist()
		.get(`/${API_PREFIX}/${PackageManagement.RESOURCE}`)
		.query({
			limit: 1,
		})
		.reply(200, [packageDb])
		.get(`/${API_PREFIX}/${PackageManagement.RESOURCE}/packageUid`)
		.reply(200, packageDb)
		.post(`/${API_PREFIX}/${PackageManagement.RESOURCE}`, JSON.stringify(packageRequestCreate))
		.reply(201, successRes, getLocationHeader(`packageUid`))
		.put(
			`/${API_PREFIX}/${PackageManagement.RESOURCE}/packageUid`,
			JSON.stringify({
				label: 'signageOS Management updated',
				description: undefined,
			}),
		)
		.reply(200, successRes, getLocationHeader(`packageUid`));

	const packageManagement = new PackageManagement(nockOpts);

	it('should get list of packages by filter', async () => {
		const packagesDb = await packageManagement.list({
			limit: 1,
		});

		should(packagesDb[0]).deepEqual(packageDb);
	});

	it('should get package by uid', async () => {
		const packageRequest = await packageManagement.get('packageUid');

		should(packageRequest).deepEqual(packageDb);
	});

	it('should create package', async () => {
		const packageRequest = await packageManagement.create(packageRequestCreate);
		should(packageRequest).deepEqual(packageDb);
	});

	it('should update package', async () => {
		const packageRequest = await packageManagement.update('packageUid', {
			label: 'signageOS Management updated',
			description: undefined,
		});
		should(packageRequest).deepEqual(packageDb);
	});
});
