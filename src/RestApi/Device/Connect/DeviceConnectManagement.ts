import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import { postResource } from '../../requester';
import { IDeviceConnectCreatable } from './IDeviceConnect';

enum OperationType {
	Connect = 'connect',
	Disconnect = 'disconnect',
}

/**
 * Device Connect API
 * Allows to connect and disconnect specific device with a local developed applet.
 * So it can be easily developed and tested according to locally built applet.
 */
export default class DeviceConnectManagement {
	private static getUrl(deviceUid: string, operationType: OperationType): string {
		return `${Resources.Device}/${deviceUid}/${operationType}`;
	}

	constructor(private options: IOptions) {}

	/**
	 * Connects device with a local developed applet.
	 * The device will be in the development state until it is disconnected.
	 */
	public async connect(deviceUid: string, options: IDeviceConnectCreatable) {
		await postResource(this.options, DeviceConnectManagement.getUrl(deviceUid, OperationType.Connect), JSON.stringify(options));
	}

	/**
	 * Disconnects device from a local developed applet.
	 * It returns the device to the production state it was before the connection.
	 */
	public async disconnect(deviceUid: string) {
		await postResource(this.options, DeviceConnectManagement.getUrl(deviceUid, OperationType.Disconnect), JSON.stringify({}));
	}
}
