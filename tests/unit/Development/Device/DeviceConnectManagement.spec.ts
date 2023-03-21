import * as should from 'should';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { DeviceConnectManagement } from "../../../../src/Development/Device/DeviceConnectManagement";
import RestApi from "../../../../src/RestApi/RestApi";
import RestApiV2 from "../../../../src/RestApi/RestApiV2";
import { IDevice } from '../../../../src/RestApi/V2/Device/Device';
import DeviceManagementV2 from '../../../../src/RestApi/V2/Device/DeviceManagement';
import DeviceManagement from '../../../../src/RestApi/Device/DeviceManagement';
import DeviceConnectManagementV1 from '../../../../src/RestApi/Device/Connect/DeviceConnectManagement';
import { IDeviceConnectCreatable } from '../../../../src/RestApi/Device/Connect/IDeviceConnect';
import { deserializeJSON } from '../../../../src/Utils/json';
import { IPowerActionUpdatable, DevicePowerAction } from '../../../../src/RestApi/Device/PowerAction/IPowerAction';

describe('Development.Device.DeviceConnectManagement', function () {

	let connects: { deviceUid: string; options: IDeviceConnectCreatable }[] = [];
	let disconnects: { deviceUid: string }[] = [];
	let reloads: { deviceUid: string; options: IPowerActionUpdatable }[] = [];
	const restApiV1 = {
		device: {
			connect: {
				async connect(deviceUid: string, options: IDeviceConnectCreatable) {
					connects.push({ deviceUid, options });
				},
				async disconnect(deviceUid: string) {
					disconnects.push({ deviceUid });
				},
			} as Partial<DeviceConnectManagementV1>,
			powerAction: {
				async set(deviceUid: string, options: IPowerActionUpdatable) {
					reloads.push({ deviceUid, options });
				},
			},
		} as Partial<DeviceManagement>,
	} as RestApi;
	const restApiV2 = {
		device: {
			async get(deviceUid) {
				return {
					uid: deviceUid,
				} as IDevice;
			},
		} as Partial<DeviceManagementV2>,
	} as RestApiV2;
	const deviceConnectManagement = new DeviceConnectManagement(restApiV1, restApiV2);

	beforeEach(async function () {
		connects = [];
		disconnects = [];
		reloads = [];
	});

	describe('connect', function () {

		it('should connect and then disconnect device, create and delete connection.json files', async function () {
			const deviceConnection = await deviceConnectManagement.connect('deviceUid', {
				appletUid: 'appletUid',
				appletVersion: '0.0.1',
				appletPublicUrl: '192.168.1.10',
			});

			const connectionsDir = path.join(os.tmpdir(), 'signageos', 'device_connections');
			should(await fs.readdir(connectionsDir)).eql([
				'deviceUid',
			]);
			const deviceDir = path.join(connectionsDir, 'deviceUid');
			should(await fs.readdir(deviceDir)).eql([
				'connection.json',
			]);
			const connectionMetadataRaw = await fs.readFile(path.join(deviceDir, 'connection.json'));
			const connectionMetadata = JSON.parse(connectionMetadataRaw.toString(), deserializeJSON);
			should(connectionMetadata.connectedAt).Date();
			should(connects).eql([{ deviceUid: 'deviceUid', options: {
				appletUid: 'appletUid',
				appletVersion: '0.0.1',
				appletPublicUrl: '192.168.1.10',
			}}]);
			should(disconnects).eql([]);

			await deviceConnection.disconnect();

			should(await fs.readdir(connectionsDir)).eql([]);
			should(connects).eql([{ deviceUid: 'deviceUid', options: {
				appletUid: 'appletUid',
				appletVersion: '0.0.1',
				appletPublicUrl: '192.168.1.10',
			}}]);
			should(disconnects).eql([{ deviceUid: 'deviceUid' }]);
		});
	});

	describe('reloadConnected', function () {

		it('should applet reload all connected devices', async function () {
			const deviceConnection1 = await deviceConnectManagement.connect('deviceUid1', {
				appletUid: 'appletUid',
				appletVersion: '0.0.1',
				appletPublicUrl: '192.168.1.10',
			});
			const deviceConnection2 = await deviceConnectManagement.connect('deviceUid2', {
				appletUid: 'appletUid',
				appletVersion: '0.0.1',
				appletPublicUrl: '192.168.1.10',
			});

			await deviceConnectManagement.reloadConnected();
			should(reloads).eql([
				{ deviceUid: 'deviceUid1', options: { devicePowerAction: DevicePowerAction.AppletReload } },
				{ deviceUid: 'deviceUid2', options: { devicePowerAction: DevicePowerAction.AppletReload } },
			]);

			await deviceConnection1.disconnect();
			await deviceConnectManagement.reloadConnected();
			should(reloads).eql([
				{ deviceUid: 'deviceUid1', options: { devicePowerAction: DevicePowerAction.AppletReload } },
				{ deviceUid: 'deviceUid2', options: { devicePowerAction: DevicePowerAction.AppletReload } },
				{ deviceUid: 'deviceUid2', options: { devicePowerAction: DevicePowerAction.AppletReload } },
			]);

			await deviceConnection2.disconnect();
		});
	});
});
