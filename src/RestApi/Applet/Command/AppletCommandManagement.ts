import { getResource, parseJSONResponse, postResource } from "../../requester";
import IOptions from "../../IOptions";
import { RESOURCE as APPLET } from "../AppletManagement";
import IAppletCommandFilter from "./IAppletCommandFilter";
import IAppletCommand, { IAppletCommandSendable } from "./IAppletCommand";
import { RESOURCE as DEVICE } from "../../Device/DeviceManagement";
import AppletCommand from "./AppletCommand";

export default class AppletCommandManagement {

	private static getResource(deviceUid: string, appletUid: string): string {
		return `${DEVICE}/${deviceUid}/${APPLET}/${appletUid}/command`;
	}

	constructor(private options: IOptions) {
	}

	public async list(deviceUid: string, appletUid: string, filter: IAppletCommandFilter = {}): Promise<IAppletCommand[]> {
		const response = await getResource(this.options, AppletCommandManagement.getResource(deviceUid, appletUid), filter);
		const data: IAppletCommand[] = await parseJSONResponse(response);

		return data.map((item: IAppletCommand) => new AppletCommand(item));
	}

	public async get(deviceUid: string, appletUid: string, cmdUid: string): Promise<IAppletCommand> {
		const url = AppletCommandManagement.getResource(deviceUid, appletUid) + '/' + cmdUid;
		const response = await getResource(this.options, url);

		return new AppletCommand(await parseJSONResponse(response));
	}

	public async send(deviceUid: string, appletUid: string, settings: IAppletCommandSendable): Promise<void> {
		await postResource(this.options, AppletCommandManagement.getResource(deviceUid, appletUid), JSON.stringify(settings));
	}

}
