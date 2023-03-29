import RestApi from "../RestApi/RestApi";
import RestApiV2 from "../RestApi/RestApiV2";
import { AppletManagement } from "./Applet/AppletManagement";
import { DeviceConnectManagement } from "./Device/DeviceConnectManagement";

/**
 * Development management contains all development related functionality.
 * It is used to manage applets and devices in signageOS environment.
 */
export class Development {

	public readonly deviceConnect: DeviceConnectManagement;
	public readonly applet: AppletManagement;

	constructor(
		private restApiV1: RestApi,
		private restApiV2: RestApiV2,
	) {
		this.deviceConnect = new DeviceConnectManagement(this.restApiV1, this.restApiV2);
		this.applet = new AppletManagement(this.restApiV1, this.deviceConnect);
	}
}
