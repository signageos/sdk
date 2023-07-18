import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, nockAuthHeader1, successRes } from '../helper';
import { IBulkOperationCreatable } from '../../../../src/RestApi/BulkOperation/IBulkOperation';
import { DeviceActionType } from '../../../../src/RestApi/BulkOperation/BulkOperation.enums';
import BulkOperation from '../../../../src/RestApi/BulkOperation/BulkOperation';
import BulkOperationManagement from '../../../../src/RestApi/BulkOperation/BulkOperationManagement';

const nockOpts = getNockOpts({});
const bulkOperationResource = 'bulk-operation';

describe('BulkOperationManagement', () => {
	const getLocationHeader = (bulkOperationUid: string): nock.HttpHeaders => ({
		Location: `${nockOpts.url}/${nockOpts.version}/${bulkOperationResource}/${bulkOperationUid}`,
	});

	const testingDate = new Date();

	const bulkOperationDb = new BulkOperation({
		uid: 'testingUid',
		deviceUids: [],
		successfulDeviceUids: [],
		failedDeviceUids: [],
		skippedDeviceUids: [],
		name: 'testingName4',
		filter: {
			applicationType: 'tizen',
		},
		createdAt: 'createdAtDate',
		schedule: {
			datetime: testingDate,
			timezone: 'Europe/Prague',
		},
		rollingUpdate: {
			batchSize: 10,
			batchDelay: 60_000,
			stopThreshold: 50,
		},
		operationType: DeviceActionType.SET_APPLICATION_VERSION,
		data: {
			applicationType: 'tizen',
			version: 'testingVersion',
		},
		progress: {
			total: 0,
			succeeded: 0,
			failed: 0,
			inProgress: 0,
		},
		organizationUids: ['testingOrganizationUid'],
	});

	const rollingUpdateRequest = {
		rollingUpdate: {
			batchSize: 10,
			batchDelay: 60_000,
			stopThreshold: 30,
		},
	};

	const bulkOperationRequestCreate: IBulkOperationCreatable<DeviceActionType> = {
		name: 'testingName4',
		filter: {
			applicationType: 'tizen',
		},
		schedule: {
			datetime: testingDate,
			timezone: 'Europe/Prague',
		},
		rollingUpdate: {
			batchSize: 10,
			batchDelay: 60_000,
			stopThreshold: 50,
		},
		operationType: DeviceActionType.SET_APPLICATION_VERSION,
		data: {
			applicationType: 'tizen',
			version: 'testingVersion',
		},
	};

	nock(nockOpts.url, nockAuthHeader1)
		.persist()
		.get(`/v1/${bulkOperationResource}`)
		.query({
			limit: 1,
			offset: 1,
		})
		.reply(200, [bulkOperationDb])
		.get(`/v1/${bulkOperationResource}/bulkOperationUid`)
		.reply(200, bulkOperationDb)
		.post(`/v1/${bulkOperationResource}`, JSON.stringify(bulkOperationRequestCreate))
		.reply(201, successRes, getLocationHeader(`bulkOperationUid`))
		.put(`/v1/${bulkOperationResource}/bulkOperationUid/stop`, {})
		.reply(200, successRes)
		.put(`/v1/${bulkOperationResource}/bulkOperationUid/pause`, {})
		.reply(200, successRes)
		.put(`/v1/${bulkOperationResource}/bulkOperationUid/archive`, {})
		.reply(200, successRes)
		.put(`/v1/${bulkOperationResource}/bulkOperationUid/resume`, rollingUpdateRequest)
		.reply(200, successRes);

	const bulkOperationManagement = new BulkOperationManagement(nockOpts);

	it('should get bulk operation by its uid', async () => {
		const bulkOperation = await bulkOperationManagement.get('bulkOperationUid');
		should(bulkOperation).deepEqual(bulkOperationDb);
	});

	it('should create bulk operation', async () => {
		const bulkOperation = await bulkOperationManagement.create(bulkOperationRequestCreate);
		should(bulkOperation).deepEqual(bulkOperationDb);
	});

	it('should get bulk operations by organizationUid', async () => {
		const bulkOperation = await bulkOperationManagement.list({
			limit: 1,
			offset: 1,
		});
		should(bulkOperation[0]).deepEqual(bulkOperationDb);
	});

	it('should stop bulk operation by uid', async () => {
		await should(bulkOperationManagement.stop('bulkOperationUid')).be.fulfilled();
	});

	it('should archive bulk operation by uid', async () => {
		await should(bulkOperationManagement.archive('bulkOperationUid')).be.fulfilled();
	});

	it('should pause bulk operation by uid', async () => {
		await should(bulkOperationManagement.pause('bulkOperationUid')).be.fulfilled();
	});

	it('should resume bulk operation by uid', async () => {
		await should(bulkOperationManagement.resume('bulkOperationUid', rollingUpdateRequest)).be.fulfilled();
	});
});
