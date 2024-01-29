import * as should from 'should';
import * as faker from 'faker';

import { Api } from '../../../../src';
import { opts } from '../helper';
import IPackageFilter from '../../../../src/RestApi/Package/IPackageFilter';
import { parameters } from '../../../../src/parameters';
import { IPackageCreatable } from '../../../../src/RestApi/Package/IPackage';

const api = new Api(opts);

describe('RestAPI - Package', () => {
	it('should get the list of existing packages', async () => {
		const filter: IPackageFilter = {
			limit: 3,
		};
		const packages = await api.package.list(filter);
		should(packages.length).be.eql(3);
		should(packages[0].ownerOrganizationUid).be.eql(parameters.organizationUid);
		should(packages[1].ownerOrganizationUid).be.eql(parameters.organizationUid);
		should(packages[2].ownerOrganizationUid).be.eql(parameters.organizationUid);
	});

	it('should create a package', async () => {
		const testingPackage: IPackageCreatable = {
			packageName: faker.system.fileName(),
			label: faker.system.fileName(),
			description: undefined,
		};
		const createdPackage = await api.package.create(testingPackage);
		should(createdPackage.packageName).be.eql(testingPackage.packageName);
		should(createdPackage.label).be.eql(testingPackage.label);
		should(createdPackage.description).be.eql(null);
		should(createdPackage.ownerOrganizationUid).be.eql(parameters.organizationUid);
	});

	it('should get package', async () => {
		const testingPackage: IPackageCreatable = {
			packageName: faker.random
				.words(faker.random.number({ min: 2, max: 6 }))
				.split(' ')
				.join('.'),
			label: faker.system.fileName(),
			description: undefined,
		};
		const { uid } = await api.package.create(testingPackage);
		const createdPackage = await api.package.get(uid);
		should(createdPackage.packageName).be.eql(testingPackage.packageName);
		should(createdPackage.label).be.eql(testingPackage.label);
		should(createdPackage.description).be.eql(null);
		should(createdPackage.ownerOrganizationUid).be.eql(parameters.organizationUid);
	});

	it('should update package', async () => {
		const testingPackage: IPackageCreatable = {
			packageName: faker.system.fileName(),
			label: faker.system.fileName(),
			description: undefined,
		};

		const updateObject = {
			label: 'new label',
			description: 'new description',
		};

		const { uid } = await api.package.create(testingPackage);
		const updatedPackage = await api.package.update(uid, updateObject);
		should(updatedPackage.packageName).be.eql(testingPackage.packageName);
		should(updatedPackage.label).be.eql(updateObject.label);
		should(updatedPackage.description).be.eql(updateObject.description);
		should(updatedPackage.ownerOrganizationUid).be.eql(parameters.organizationUid);
	});
});
