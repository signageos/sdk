import * as should from 'should';

import { Api } from '../../../../src';
import { opts } from '../helper';
import { DeviceActionType } from '../../../../src/RestApi/BulkOperation/BulkOperation.enums';
import { LogDataMock } from './BulkOperation.fixtures';
import IDevice from '../../../../src/RestApi/Device/IDevice';
import Organization from '../../../../src/RestApi/Organization/Organization';
import { IPackage } from '../../../../src/RestApi/Package/IPackage';
import * as faker from 'faker';
// import { SheduledActionDay } from '../../../../src/RestApi/Device/PowerAction/IScheduledPowerAction';
// import { DevicePowerAction } from '../../../../src/RestApi/Device/PowerAction/IPowerAction';
import IPolicy from '../../../../src/RestApi/Policy/IPolicy';
import IApplet from '../../../../src/RestApi/Applet/IApplet';
import ITiming from '../../../../src/RestApi/Timing/ITiming';
import { parameters } from '../../../../src/parameters';

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

describe.only('RestAPI - BulkOperation', function () {
	let device: IDevice;
	let organization: Organization;
	let testingPackage: IPackage;
	let scheduledPowerActionUid: string;
	let policy: IPolicy;
	let applet: IApplet;
	let appletVersion: string;
	let timing: ITiming;

	// packageName: (es: IEventStore, packageName: string): void | string => {
	// 	const devicePackage = getDevicePackageByPackageName(es, packageName);
	// 	if (!devicePackage) {
	// 		return `Package ${packageName} does not exist`;
	// 	}
	// },
	// 	scheduledPowerActionUid: (es: IEventStore, scheduledPowerActionUid: string): void | string => {
	// 	const scheduledAction = getDeviceScheduledPowerActionByUid(es, scheduledPowerActionUid);
	// 	if (!scheduledAction) {
	// 		return `Scheduled power action ${scheduledPowerActionUid} does not exist`;
	// 	}
	// 	if (scheduledAction.failedAt || scheduledAction.succeededAt || scheduledAction.canceledAt) {
	// 		return `Scheduled power action ${scheduledPowerActionUid} was already processed`;
	// 	}
	// },
	// 	verificationHash: (es: IEventStore, verificationHash: string, operationType?: DeviceActionType): void | string => {
	// 	const verification = getPairedDeviceVerificationByVerificationHash(es, verificationHash);
	// 	if (operationType === DeviceActionType.PROVISION) {
	// 		if (verification) {
	// 			return `Device ${verification.deviceUid} was already provisioned with hash ${verificationHash}`;
	// 		}
	// 		return;
	// 	}
	// 	// DEPROVISION default behaviour
	// 	if (!verification) {
	// 		return `Device with verification hash ${verificationHash} is not provisioned`;
	// 	}
	// },
	// 	appletUid: (es: IEventStore, appletUid: string): void | string => {
	// 	const appletMap = getAppletToOrganizationMapByOrganizationUid(es, Set().add(appletUid));
	// 	if (!appletMap.get(appletUid)) {
	// 		return `Applet ${appletUid} does not exist`;
	// 	}
	// },
	// 	appletVersion: (es: IEventStore, appletVersion: string): void | string => {
	// 	if (!getAppletVersionByVersion(es, appletVersion)) {
	// 		return `Applet version ${appletVersion} does not exist`;
	// 	}
	// },
	// 	uid: (es: IEventStore, uid: string): void | string => {
	// 	if (!getTimingByUid(es, uid)) {
	// 		return `Timing with uid ${uid} does not exist`;
	// 	}
	// },
	// 	policyUid: (es: IEventStore, policyUid: string): void | string => {
	// 	if (!getLatestPolicyLogByUid(es, policyUid)) {
	// 		return `Policy with uid ${policyUid} does not exist`;
	// 	}
	// },
	// 	deviceIdentityHash: (es: IEventStore, deviceIdentityHash: string): void | string => {
	// 	if (!getDeviceByIdentityHash(es, deviceIdentityHash)) {
	// 		return `Device with identity hash ${deviceIdentityHash} does not exist`;
	// 	}
	// },
	// 	organizationUid: (es: IEventStore, organizationUid: string): void | string => {
	// 	if (!getOrganizationByUid(es, organizationUid)) {
	// 		return `Organization with uid ${organizationUid} does not exist`;
	// 	}
	// },

	before('create fixtures', async function () {
		// const randomString = Math.random().toString(36).substring(7);

		// organization = await api.organization.create({ name: `sdk-test-${randomString}`, title: `SDK test ${randomString}` });

		device = await api.emulator.create({ organizationUid: parameters.organizationUid! });

		testingPackage = await api.package.create({
			packageName: faker.system.fileName(),
			label: faker.system.fileName(),
			description: undefined,
		});
		// console.log('testingPackage4');
		// scheduledPowerActionUid = await api.device.scheduledPowerAction.create(device.uid, {
		// 	powerAction: DevicePowerAction.SystemReboot,
		// 	weekdays: [SheduledActionDay.Sunday],
		// 	time: '00:00',
		// });

		policy = await api.policy.create({
			name: faker.system.fileName(),
			organizationUid: parameters.organizationUid!,
		});

		applet = await api.applet.create({ name: faker.system.fileName() });
		appletVersion = faker.system.semver();
		await api.applet.version.create(applet.uid, { version: appletVersion, entryFile: faker.system.fileName() });
		timing = await api.timing.create({
			deviceUid: device.uid,
			appletUid: applet.uid,
			appletVersion,
			startsAt: new Date(),
			endsAt: new Date(),
			configuration: {},
			finishEvent: {
				type: 'DURATION',
				data: {},
			},
			position: 1,
		});

		console.log('timing', timing);
		console.log('organization', organization);
		console.log('device', device);
		console.log('package', testingPackage);
		console.log('scheduledPowerActionUid', scheduledPowerActionUid);
		console.log('policy', policy);
		console.log('applet', applet);
		console.log('appletVersion', appletVersion);
		console.log('timing', timing);
	});

	after('remove fixtures', async function () {
		await api.organization.delete(organization.uid);
		await api.emulator.delete(device.uid);
	});

	it.only('should create new bulk operation', async () => {
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
