import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from "../../requester";
import IOptions from "../../IOptions";
import { RESOURCE as APPLET } from "../AppletManagement";
import IAppletTestSuite, { IAppletTestSuiteCreatable, IAppletTestSuiteUpdatable } from "./IAppletTestSuite";
import AppletTestSuite from "./AppletTestSuite";

export default class AppletTestSuiteManagement {

	private static getResource(appletUid: string, appletVersion: string): string {
		return `${APPLET}/${appletUid}/version/${appletVersion}/test`;
	}

	private static getDetailResource(appletUid: string, appletVersion: string, identifier: string): string {
		return `${APPLET}/${appletUid}/version/${appletVersion}/test/${identifier}`;
	}

	constructor(private options: IOptions) {
	}

	public async list(appletUid: string, appletVersion: string): Promise<IAppletTestSuite[]> {
		const url = AppletTestSuiteManagement.getResource(appletUid, appletVersion);
		const response = await getResource(this.options, url);
		const data: IAppletTestSuite[] = await parseJSONResponse(response);

		return data.map((item: IAppletTestSuite) => new AppletTestSuite(item));
	}

	public async get(appletUid: string, appletVersion: string, identifier: string): Promise<IAppletTestSuite> {
		const url = AppletTestSuiteManagement.getResource(appletUid, appletVersion) + '/' + identifier;
		const response = await getResource(this.options, url);

		return new AppletTestSuite(await parseJSONResponse(response));
	}

	public async create(
		appletUid: string,
		appletVersion: string,
		identifier: string,
		settings: IAppletTestSuiteCreatable
	): Promise<void> {
		const url = AppletTestSuiteManagement.getDetailResource(appletUid, appletVersion, identifier);
		await postResource(this.options, url, JSON.stringify(settings));
	}

	public async update(
		appletUid: string,
		appletVersion: string,
		identifier: string,
		settings: IAppletTestSuiteUpdatable
	): Promise<void> {
		const url = AppletTestSuiteManagement.getDetailResource(appletUid, appletVersion, identifier);
		await putResource(this.options, url, JSON.stringify(settings));
	}

	public async delete(
		appletUid: string,
		appletVersion: string,
		identifier: string,
	): Promise<void> {
		const url = AppletTestSuiteManagement.getDetailResource(appletUid, appletVersion, identifier);
		await deleteResource(this.options, url);
	}

}
