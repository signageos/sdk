import * as should from 'should';

import { Api } from '../../../../src';
import { opts } from '../helper';
import { DeviceActionType } from '../../../../src/RestApi/BulkOperation/BulkOperation.enums';
import { LogDataMock } from './BulkOperation.fixtures';

const testingBulkOperation = {
	name: 'testingName4',
	filter: {
		applicationType: 'tizen',
	},
	schedule: {
		datetime: new Date(),
		timezone: 'Europe/Prague',
	},
	rollingUpdate: {
		batchSize: 1,
		batchDelay: 1000,
		stopThreshold: 50,
	},
	operationType: DeviceActionType.SET_APPLICATION_VERSION,
	data: {
		applicationType: 'tizen',
		version: 'testingVersion',
	},
};

const api = new Api(opts);

describe('RestAPI - BulkOperation', function () {
	it('should create new bulk operation', async () => {
		const createdBulkOperation = await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();
		should(createdBulkOperation.name).be.eql(testingBulkOperation.name);
		should(createdBulkOperation.operationType).be.eql(testingBulkOperation.operationType);
		should(createdBulkOperation.data).be.eql(testingBulkOperation.data);
		should(createdBulkOperation.rollingUpdate).be.eql(testingBulkOperation.rollingUpdate);
		should('createdAt' in createdBulkOperation).be.eql(true);
	});

	it('should get bulk operation by uid', async () => {
		const createdBulkOperation = await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();
		const bulkOperationGet = await api.bulkOperation.get(createdBulkOperation.uid);
		should(bulkOperationGet.name).be.eql(testingBulkOperation.name);
		should(bulkOperationGet.operationType).be.eql(testingBulkOperation.operationType);
		should(bulkOperationGet.rollingUpdate).be.deepEqual(testingBulkOperation.rollingUpdate);
		should(bulkOperationGet.data).be.deepEqual(testingBulkOperation.data);
		should(bulkOperationGet.organizationUids[0]).be.eql(opts.organizationUid!);
		should('createdAt' in bulkOperationGet).be.eql(true);
	});

	it('should get bulk operation by organization uid', async () => {
		await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();
		await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();

		const bulkOperationGetArray = await api.bulkOperation.list({
			limit: 1,
			offset: 1,
		});
		should(bulkOperationGetArray.length).be.eql(1);
		should(bulkOperationGetArray[0].operationType).be.eql(testingBulkOperation.operationType);
		should(bulkOperationGetArray[0].rollingUpdate).be.deepEqual(testingBulkOperation.rollingUpdate);
		should(bulkOperationGetArray[0].data).be.deepEqual(testingBulkOperation.data);
		should(bulkOperationGetArray[0].organizationUids[0]).be.eql(opts.organizationUid!);
		should('createdAt' in bulkOperationGetArray[0]).be.eql(true);
	});

	it('should stop bulk operation by uid', async () => {
		const createdBulkOperation = await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();

		await api.bulkOperation.stop(createdBulkOperation.uid);

		const bulkOperationGet = await api.bulkOperation.get(createdBulkOperation.uid);

		should('stoppedAt' in bulkOperationGet).be.eql(true);
	});

	it('should archive bulk operation by uid', async () => {
		const createdBulkOperation = await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();

		await api.bulkOperation.archive(createdBulkOperation.uid);

		const bulkOperationGet = await api.bulkOperation.get(createdBulkOperation.uid);

		should('archivedAt' in bulkOperationGet).be.eql(true);
	});

	it('should pause bulk operation by uid', async () => {
		const createdBulkOperation = await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();

		await api.bulkOperation.pause(createdBulkOperation.uid);

		const bulkOperationGet = await api.bulkOperation.get(createdBulkOperation.uid);

		should('pausedAt' in bulkOperationGet).be.eql(true);
	});

	it('should pause and resume bulk operation by uid', async () => {
		const createdBulkOperation = await should(api.bulkOperation.create(testingBulkOperation)).be.fulfilled();

		await api.bulkOperation.pause(createdBulkOperation.uid);

		const newRollingUpdate = {
			rollingUpdate: {
				batchSize: 20,
				batchDelay: 2000,
				stopThreshold: 75,
			},
		};

		await api.bulkOperation.resume(createdBulkOperation.uid, newRollingUpdate);

		const bulkOperationGet = await api.bulkOperation.get(createdBulkOperation.uid);

		should('resumedAt' in bulkOperationGet).be.eql(true);
		should(bulkOperationGet.rollingUpdate).be.deepEqual(newRollingUpdate.rollingUpdate);
	});

	describe('Bulk operation all possible payloads', async function () {
		for (const operationType of Object.values(DeviceActionType)) {
			const bulkData = LogDataMock[operationType];
			it(`should create bulk operation with payload of - ${operationType}`, async function () {
				const createdBulkOperation = await should(
					api.bulkOperation.create({ ...testingBulkOperation, operationType, ...{ data: bulkData } }),
				).be.fulfilled();
				should(createdBulkOperation.name).be.eql(testingBulkOperation.name);
				should(createdBulkOperation.operationType).be.eql(operationType);
				should(createdBulkOperation.data).deepEqual(bulkData);
				should(createdBulkOperation.rollingUpdate).be.eql(testingBulkOperation.rollingUpdate);
				should('createdAt' in createdBulkOperation).be.eql(true);
			});
		}
	});
});
