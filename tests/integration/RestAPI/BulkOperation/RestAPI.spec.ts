import * as should from 'should';
import { Api } from '../../../../src';
import { opts } from '../helper';
import {
	ApplicationType,
	DeviceActionType,
	Orientation,
	VideoOrientation,
} from '../../../../src/RestApi/BulkOperation/BulkOperation.enums';
import IDevice from '../../../../src/RestApi/Device/IDevice';
import Organization from '../../../../src/RestApi/Organization/Organization';
import { IPackage } from '../../../../src/RestApi/Package/IPackage';
import * as faker from 'faker';
import { SheduledActionDay } from '../../../../src/RestApi/Device/PowerAction/IScheduledPowerAction';
import { DevicePowerAction } from '../../../../src/RestApi/Device/PowerAction/IPowerAction';
import IPolicy from '../../../../src/RestApi/Policy/IPolicy';
import IApplet from '../../../../src/RestApi/Applet/IApplet';
import ITiming from '../../../../src/RestApi/Timing/ITiming';
import { parameters } from '../../../../src/parameters';
import { LogData } from '../../../../src/RestApi/BulkOperation/BulkOperation.types';
import { InputSource } from '../../../../src/RestApi/Device/InputSource';
import { SocketDriver } from '../../../../src/RestApi/V2/Device/Device';
import { IBulkOperationCreatable } from '../../../../src/RestApi/BulkOperation/IBulkOperation';

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
		batchSize: 10,
		batchDelay: 60_000 * 2,
		stopThreshold: 100,
	},
	operationType: DeviceActionType.SET_APPLICATION_VERSION,
	data: {
		applicationType: 'tizen' as ApplicationType,
		version: 'testingVersion',
	},
};

const api = new Api(opts);

describe('RestAPI - BulkOperation', function () {
	let device: IDevice;
	let organization: Organization;
	let testingPackage: IPackage;
	let scheduledPowerActionUid: string;
	let policy: IPolicy;
	let applet: IApplet;
	let appletVersion: string;
	let timing: ITiming;

	before('create fixtures', async function () {
		organization = await api.organization.get(parameters.organizationUid!);

		device = await api.emulator.create({ organizationUid: parameters.organizationUid! });

		testingPackage = await api.package.create({
			packageName: faker.system.fileName(),
			label: faker.system.fileName(),
			description: undefined,
		});

		scheduledPowerActionUid = await api.device.scheduledPowerAction.create(device.uid, {
			powerAction: DevicePowerAction.SystemReboot,
			weekdays: [SheduledActionDay.Sunday],
			time: '00:00:00',
		});

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
	});

	after('remove fixtures', async function () {
		await api.emulator.delete(device.uid);
	});

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
		const createdBulkOperation = await should(
			api.bulkOperation.create({
				...testingBulkOperation,
				...{
					rollingUpdate: {
						batchSize: 1,
						batchDelay: 60_000 * 2,
						stopThreshold: 50,
					},
				},
			}),
		).be.fulfilled();

		await api.bulkOperation.pause(createdBulkOperation.uid);

		const newRollingUpdate = {
			rollingUpdate: {
				batchSize: 20,
				batchDelay: 60_000 * 2,
				stopThreshold: 75,
			},
		};

		await api.bulkOperation.resume(createdBulkOperation.uid, newRollingUpdate);

		const bulkOperationGet = await api.bulkOperation.get(createdBulkOperation.uid);

		should('resumedAt' in bulkOperationGet).be.eql(true);
		should(bulkOperationGet.rollingUpdate).be.deepEqual(newRollingUpdate.rollingUpdate);
	});

	describe('Bulk operation all possible payloads', async function () {
		async function assertBulkOperation<T extends DeviceActionType>(bulkData: LogData[T], operationType: T) {
			const toCreate: IBulkOperationCreatable<DeviceActionType> = {
				...testingBulkOperation,
				operationType: operationType,
				...{ data: bulkData },
			};
			const createdBulkOperation = await should(api.bulkOperation.create(toCreate)).be.fulfilled();
			should(createdBulkOperation.name).be.eql(testingBulkOperation.name);
			should(createdBulkOperation.operationType).be.eql(operationType);
			should(createdBulkOperation.data).deepEqual(bulkData);
			should(createdBulkOperation.rollingUpdate).be.eql(testingBulkOperation.rollingUpdate);
			should('createdAt' in createdBulkOperation).be.eql(true);
		}

		it('should create new bulk operation with payload application version', async function () {
			let bulkData = {
				applicationType: /* 'tizen' */ device.applicationType as ApplicationType,
				version: '1.0.0',
			};

			await assertBulkOperation(bulkData, DeviceActionType.SET_APPLICATION_VERSION);
		});

		it('should create new bulk operation with payload volume', async function () {
			let bulkData = {
				[DeviceActionType.SET_VOLUME]: {
					volume: 10,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_VOLUME);
		});

		it('should create new bulk operation with payload brightness', async function () {
			let bulkData = {
				[DeviceActionType.SET_BRIGHTNESS]: {
					brightness1: 10,
					brightness2: 15,
					timeFrom1: '10:00:00',
					timeFrom2: '11:00:00',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_BRIGHTNESS);
		});

		it('should create new bulk operation with payload reconnect', async function () {
			let bulkData = {
				[DeviceActionType.RECONNECT]: {},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.RECONNECT);
		});

		it('should create new bulk operation with payload update configuration', async function () {
			let bulkData = {
				[DeviceActionType.UPDATE_CONFIGURATION]: {
					platformUri: 'testingPLatformUri',
					staticBaseUrl: 'testingStaticBaseUrl',
					uploadBaseUrl: 'testingUploadBaseUrl',
					weinreUri: 'testingWeinreUri',
					extendedManagementUrl: 'testingManagementUrl',
					socketDriver: SocketDriver.Websocket,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.UPDATE_CONFIGURATION);
		});

		it('should create new bulk operation with payload update time', async function () {
			let bulkData = {
				[DeviceActionType.UPDATE_TIME]: {
					timezone: 'Africa/Accra',
					timestamp: 10000000,
					ntpServer: 'testingNtpServer',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.UPDATE_TIME);
		});

		it('should create new bulk operation with payload set debug', async function () {
			let bulkData = {
				[DeviceActionType.SET_DEBUG]: {
					appletEnabled: false,
					nativeEnabled: true,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_DEBUG);
		});

		it('should create new bulk operation with payload set firmware version', async function () {
			let bulkData = {
				[DeviceActionType.SET_FIRMWARE_VERSION]: {
					version: '1.0.0',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_FIRMWARE_VERSION);
		});

		it('should create new bulk operation with payload install package', async function () {
			let bulkData = {
				[DeviceActionType.INSTALL_PACKAGE]: {
					packageName: /* 'testingPackageName' */ testingPackage.packageName,
					applicationType: device.applicationType,
					buildHash: 'testingBuildHash',
					version: 'testingVersion',
					build: 'testingBuild',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.INSTALL_PACKAGE);
		});

		it('should create new bulk operation with payload install package from uri', async function () {
			let bulkData = {
				[DeviceActionType.INSTALL_PACKAGE_FROM_URI]: {
					packageUri: 'testingUri',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.INSTALL_PACKAGE_FROM_URI);
		});

		it('should create new bulk operation with payload uninstall package', async function () {
			let bulkData = {
				[DeviceActionType.UNINSTALL_PACKAGE]: {
					packageName: /* 'testingPackageName' */ testingPackage.packageName,
					applicationType: device.applicationType,
					specs: {
						someField: 'someValue',
					},
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.UNINSTALL_PACKAGE);
		});

		it('should create new bulk operation with payload power action', async function () {
			let bulkData = {
				[DeviceActionType.POWER_ACTION]: {
					powerType: 'APP_RESTART',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.POWER_ACTION);
		});

		it('should create new bulk operation with payload scheduled power action', async function () {
			let bulkData = {
				[DeviceActionType.SET_SCHEDULED_POWER_ACTION]: {
					powerType: 'APP_RESTART',
					weekdays: ['sun'],
					time: '10:00:00',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_SCHEDULED_POWER_ACTION);
		});

		it('should create new bulk operation with payload cancel scheduled power action', async function () {
			let bulkData = {
				[DeviceActionType.CANCEL_SCHEDULED_POWER_ACTION]: {
					scheduledPowerActionUid: /* 'testingPowerActionUid' */ scheduledPowerActionUid,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.CANCEL_SCHEDULED_POWER_ACTION);
		});

		it('should create new bulk operation with payload set remote control', async function () {
			let bulkData = {
				[DeviceActionType.SET_REMOTE_CONTROL]: {
					enabled: true,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_REMOTE_CONTROL);
		});

		it('should create new bulk operation with payload resize', async function () {
			let bulkData = {
				[DeviceActionType.RESIZE]: {
					resolution: {
						width: 100,
						height: 100,
						framerate: 100,
					},
					orientation: Orientation.LANDSCAPE,
					videoOrientation: VideoOrientation.LANDSCAPE,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.RESIZE);
		});

		it('should create new bulk operation with payload update name', async function () {
			let bulkData = {
				[DeviceActionType.UPDATE_NAME]: {
					name: 'newName',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.UPDATE_NAME);
		});

		it('should create new bulk operation with payload ban', async function () {
			let bulkData = {
				[DeviceActionType.BAN]: {},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.BAN);
		});

		it('should create new bulk operation with payload approve', async function () {
			let bulkData = {
				[DeviceActionType.APPROVE]: {},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.APPROVE);
		});

		it('should create new bulk operation with payload change subscription type', async function () {
			let bulkData = {
				[DeviceActionType.CHANGE_SUBSCRIPTION_TYPE]: {
					subscriptionType: 'basic',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.CHANGE_SUBSCRIPTION_TYPE);
		});

		it('should create new bulk operation with payload create timing', async function () {
			let bulkData = {
				[DeviceActionType.CREATE_TIMING]: {
					appletUid: applet.uid,
					appletVersion: appletVersion,
					configuration: {
						someField: 'someValue',
					} as Record<string, unknown>,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.CREATE_TIMING);
		});

		it('should create new bulk operation with payload update timing', async function () {
			let bulkData = {
				[DeviceActionType.UPDATE_TIMING]: {
					appletUid: applet.uid,
					appletVersion,
					configuration: {
						someField: 'someValue,',
					} as Record<string, unknown>,
					configurationSet: {
						someField: 'someValue,',
					} as Record<string, unknown>,
					configurationRemoveKeys: ['someFiled'],
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.UPDATE_TIMING);
		});

		it('should create new bulk operation with payload delete timing', async function () {
			let bulkData = {
				[DeviceActionType.DELETE_TIMING]: {
					uid: timing.uid,
					appletUid: applet.uid,
					appletVersion,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.DELETE_TIMING);
		});

		it('should create new bulk operation with payload set device applet test suite', async function () {
			let bulkData = {
				[DeviceActionType.SET_DEVICE_APPLET_TEST_SUITE]: {
					appletUid: applet.uid,
					appletVersion,
					tests: ['default'],
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_DEVICE_APPLET_TEST_SUITE);
		});

		it('should create new bulk operation with payload set test suite', async function () {
			let bulkData = {
				[DeviceActionType.SET_TEST_SUITE]: {
					tests: ['default'],
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_TEST_SUITE);
		});

		it('should create new bulk operation with payload start package', async function () {
			let bulkData = {
				[DeviceActionType.START_PACKAGE]: {
					packageName: testingPackage.packageName,
					applicationType: device.applicationType,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.START_PACKAGE);
		});

		it('should create new bulk operation with payload set timer', async function () {
			let bulkData = {
				[DeviceActionType.SET_TIMER]: {
					type: 'TIMER_3',
					volume: 10,
					weekdays: ['sun'],
					timeOn: null,
					timeOff: null,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_TIMER);
		});

		it('should create new bulk operation with payload set proprietary timer', async function () {
			let bulkData = {
				[DeviceActionType.SET_PROPRIETARY_TIMER]: {
					type: 'TIMER_3',
					volume: 10,
					weekdays: ['sun'],
					timeOn: null,
					timeOff: null,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_PROPRIETARY_TIMER);
		});

		it('should create new bulk operation with payload set power status', async function () {
			let bulkData = {
				[DeviceActionType.SET_POWER_STATUS]: {
					turnedOn: true,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_POWER_STATUS);
		});

		it('should create new bulk operation with payload set input source', async function () {
			let bulkData = {
				[DeviceActionType.SET_INPUT_SOURCE]: {
					inputSource: InputSource.URL_LAUNCHER,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_INPUT_SOURCE);
		});

		it('should create new bulk operation with payload set display backlight', async function () {
			let bulkData = {
				[DeviceActionType.SET_DISPLAY_BACKLIGHT]: {
					backlight: 10,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_DISPLAY_BACKLIGHT);
		});

		it('should create new bulk operation with payload set display contrast', async function () {
			let bulkData = {
				[DeviceActionType.SET_DISPLAY_CONTRAST]: {
					contrast: 10,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_DISPLAY_CONTRAST);
		});

		it('should create new bulk operation with payload set display sharpness', async function () {
			let bulkData = {
				[DeviceActionType.SET_DISPLAY_SHARPNESS]: {
					sharpness: 10,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_DISPLAY_SHARPNESS);
		});

		it('should create new bulk operation with payload set display temperature control', async function () {
			let bulkData = {
				[DeviceActionType.SET_DISPLAY_TEMPERATURE_CONTROL]: {
					maxTemperature: 10,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_DISPLAY_TEMPERATURE_CONTROL);
		});

		it('should create new bulk operation with payload set remote desktop', async function () {
			let bulkData = {
				[DeviceActionType.SET_REMOTE_DESKTOP]: {
					enabled: true,
					/** URL where the remote desktop will be available (usually for limited amount of time) */
					remoteDesktopUri: 'testingRemoteDesktopUri',
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_REMOTE_DESKTOP);
		});

		it('should create new bulk operation with payload set policy', async function () {
			let bulkData = {
				[DeviceActionType.SET_POLICY]: {
					policyUid: policy.uid,
					priority: 1,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_POLICY);
		});

		it('should create new bulk operation with payload delete policy', async function () {
			let bulkData = {
				[DeviceActionType.DELETE_POLICY]: {
					policyUid: policy.uid,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.DELETE_POLICY);
		});

		it('should create new bulk operation with payload set organization tags', async function () {
			let bulkData = {
				[DeviceActionType.SET_ORGANIZATION_TAGS]: {
					deviceIdentityHash: device.uid,
					tagUids: ['tagUid'],
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_ORGANIZATION_TAGS);
		});

		it('should create new bulk operation with payload delete organization tags', async function () {
			let bulkData = {
				[DeviceActionType.DELETE_ORGANIZATION_TAGS]: {
					deviceIdentityHash: device.uid,
					tagUids: ['tagUid'],
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.DELETE_ORGANIZATION_TAGS);
		});

		it('should create new bulk operation with payload set organization', async function () {
			let bulkData = {
				[DeviceActionType.SET_ORGANIZATION]: {
					organizationUid: organization.uid,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_ORGANIZATION);
		});

		it('should create new bulk operation with payload set peer recovery', async function () {
			let bulkData = {
				[DeviceActionType.SET_PEER_RECOVERY]: {
					enabled: true,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_PEER_RECOVERY);
		});

		it('should create new bulk operation with payload set auto recovery', async function () {
			let bulkData = {
				[DeviceActionType.SET_AUTO_RECOVERY]: {
					enabled: true,
					healthcheckIntervalMs: 1000,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.SET_AUTO_RECOVERY);
		});

		it('should create new bulk operation with payload enable extended telemetry', async function () {
			let bulkData = {
				[DeviceActionType.ENABLE_EXTENDED_TELEMETRY]: {
					deviceIdentityHash: device.uid,
					duration: 60000,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.ENABLE_EXTENDED_TELEMETRY);
		});

		it('should create new bulk operation with payload disable extended telemetry', async function () {
			let bulkData = {
				[DeviceActionType.DISABLE_EXTENDED_TELEMETRY]: {
					deviceIdentityHash: device.uid,
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.DISABLE_EXTENDED_TELEMETRY);
		});

		it('should create new bulk operation with payload telemetry intervals', async function () {
			let bulkData = {
				[DeviceActionType.TELEMETRY_INTERVALS]: {
					deviceIdentityHash: device.uid,
					telemetryCheckIntervals: {
						volume: 120000,
						brightness: 150000,
					},
				},
			};

			await assertBulkOperation(bulkData as LogData, DeviceActionType.TELEMETRY_INTERVALS);
		});
	});
});
