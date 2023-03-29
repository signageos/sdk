import RestApi from "../../RestApi/RestApi";
import { IDevice } from "../../RestApi/V2/Device/Device";

/**
 * Represents the development connection to a device.
 * After ending the development, it should be disconnected.
 * The disconnection can happen automatically when the device is restarted.
 */
export class DeviceConnection {

	constructor(
		private restApiV1: RestApi,
		private device: IDevice,
		private deleteConnectionFile: () => Promise<void>,
	) {}

	public async disconnect() {
		await this.deleteConnectionFile();
		await this.restApiV1.device.connect.disconnect(this.device.uid);
	}
}
