import { IDeviceConnectCreatable } from "../../RestApi/Device/Connect/IDeviceConnect";
import RestApi from "../../RestApi/RestApi";
import RestApiV2 from "../../RestApi/RestApiV2";
import { IDevice } from "../../RestApi/V2/Device/Device";
import { DeviceConnection } from "./DeviceConnection";
import * as path from 'path';
import * as os from "os";
import * as fs from 'fs-extra';
import { RUNTIME_DIRNAME } from "../runtimeFileSystem";
import { DevicePowerAction } from "../../RestApi/Device/PowerAction/IPowerAction";

const CONNECTIONS_DIRENAME = 'device_connections';
const CONNECTION_FILENAME = 'connection.json';

interface IConnectionMetadata {
	connectedAt: Date;
}

/**
 * Manages device connections for development purposes.
 * It is used to connect to the device and to reload the applet on the device.
 * Once the device is connected, it comes into the development mode and the applet is loaded from the current local file system.
 * It goes back to the production mode when the device is disconnected or restarted.
 */
export class DeviceConnectManagement {

	constructor(
		private restApiV1: RestApi,
		private restApiV2: RestApiV2,
	) {}

	/**
	 * Connects current local machine to the device with specific applet UID and version.
	 */
	public async connect(deviceUid: string, options: IDeviceConnectCreatable): Promise<DeviceConnection> {
		const device = await this.restApiV2.device.get(deviceUid);
		await this.createConnectionFile(device);
		await this.restApiV1.device.connect.connect(deviceUid, options);
		return new DeviceConnection(
			this.restApiV1,
			device,
			() => this.deleteConnectionFile(device),
		);
	}

	/**
	 * Reloads the applet on all currently connected devices.
	 */
	public async reloadConnected() {
		const runtimeDir = this.getDevicesRuntimeDir();
		const deviceUids = await fs.readdir(runtimeDir);
		for (const deviceUid of deviceUids) {
			await this.restApiV1.device.powerAction.set(deviceUid, {
				devicePowerAction: DevicePowerAction.AppletReload,
			});
		}
		return { deviceUids };
	}

	private async createConnectionFile(device: IDevice) {
		const runtimeDir = this.getDeviceRuntimeDir(device.uid);
		await fs.ensureDir(runtimeDir);
		const connectionFilePath = path.join(runtimeDir, CONNECTION_FILENAME);
		const connection: IConnectionMetadata = {
			connectedAt: new Date(),
		};
		await fs.writeFile(connectionFilePath, JSON.stringify(connection, null, 2));
	}

	private async deleteConnectionFile(device: IDevice) {
		await fs.remove(this.getDeviceRuntimeDir(device.uid));
	}

	private getDeviceRuntimeDir(deviceUid: string) {
		const tempDir = path.join(this.getDevicesRuntimeDir(), deviceUid);
		return tempDir;
	}

	private getDevicesRuntimeDir(): string {
		return path.join(os.tmpdir(), RUNTIME_DIRNAME, CONNECTIONS_DIRENAME);
	}
}
