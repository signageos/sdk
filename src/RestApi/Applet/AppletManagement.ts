import {deleteResource, getResource, parseJSONResponse} from "../requester";
import IOptions from "../IOptions";
import IApplet, {IAppletCreatable} from "./IApplet";
import {postResource} from "../requester";
import Applet from "./Applet";

export default class AppletManagement {

	public static readonly RESOURCE: string = 'applet';

	private static getUrl(appletUid: string): string {
		return `${AppletManagement.RESOURCE}/${appletUid}/`;
	}

	constructor(private options: IOptions) {
	}

	public async list(): Promise<IApplet[]> {
		const response = await getResource(this.options, AppletManagement.RESOURCE);
		const data: IApplet[] = await parseJSONResponse(response);

		return data.map((item: IApplet) => new Applet(item));
	}

	public async get(appletUid: string): Promise<IApplet> {
		const response = await getResource(this.options, AppletManagement.getUrl(appletUid));

		return new Applet(await parseJSONResponse(response));
	}

	public async create(settings: IAppletCreatable): Promise<void> {
		await postResource(this.options, AppletManagement.RESOURCE, settings);
	}

	public async delete(appletUid: string): Promise<void> {
		await deleteResource(this.options, AppletManagement.getUrl(appletUid));
	}

}
