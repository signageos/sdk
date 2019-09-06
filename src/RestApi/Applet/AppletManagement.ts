import {deleteResource, getResource, parseJSONResponse} from "../requester";
import IOptions from "../IOptions";
import IApplet, {IAppletCreatable} from "./IApplet";
import {postResource} from "../requester";
import Applet from "./Applet";
import AppletVersionManagement from "./Version/AppletVersionManagement";
import AppletCommandManagement from "./Command/AppletCommandManagement";

export const RESOURCE: string = 'applet';

export default class AppletManagement {

	public version: AppletVersionManagement;
	public command: AppletCommandManagement;

	private static getUrl(appletUid: string): string {
		return `${RESOURCE}/${appletUid}/`;
	}

	constructor(private options: IOptions) {
		this.version = new AppletVersionManagement(options);
		this.command = new AppletCommandManagement(options);
	}

	public async list(): Promise<IApplet[]> {
		const response = await getResource(this.options, RESOURCE);
		const data: IApplet[] = await parseJSONResponse(response);

		return data.map((item: IApplet) => new Applet(item));
	}

	public async get(appletUid: string): Promise<IApplet> {
		const response = await getResource(this.options, AppletManagement.getUrl(appletUid));

		return new Applet(await parseJSONResponse(response));
	}

	public async create(settings: IAppletCreatable): Promise<void> {
		await postResource(this.options, RESOURCE, settings);
	}

	public async delete(appletUid: string): Promise<void> {
		await deleteResource(this.options, AppletManagement.getUrl(appletUid));
	}

}
