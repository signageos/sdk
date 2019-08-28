import {getResource, parseJSONResponse, postResource} from "../../requester";
import IOptions from "../../IOptions";
import AppletManagement from "../AppletManagement";
import IAppletCommandFilter from "./IAppletCommandFilter";
import IAppletCommand, {IAppletCommandSendable} from "./IAppletCommand";
import DeviceManagement from "../../Device/DeviceManagement";
import AppletCommand from "./AppletCommand";

export default class AppletCommandManagement {

	private static getResource(deviceUid: string, appletUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/${AppletManagement.RESOURCE}/${appletUid}/command`;
	}

	constructor(private options: IOptions) {
	}

	public async commands(deviceUid: string, appletUid: string, filter: IAppletCommandFilter = {}): Promise<IAppletCommand[]> {
		const response = await getResource(this.options, AppletCommandManagement.getResource(deviceUid, appletUid), filter);
		const data: IAppletCommand[] = await parseJSONResponse(response);

		return data.map((item: IAppletCommand) => new AppletCommand(item));
	}

	public async send(deviceUid: string, appletUid: string, settings: IAppletCommandSendable): Promise<void> {
		await postResource(this.options, AppletCommandManagement.getResource(deviceUid, appletUid), settings);
	}

}
