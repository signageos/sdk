import {deleteResource, getResource, parseJSONResponse} from "../requester";
import IOptions from "../IOptions";
import IApplet, {IAppletCreatable} from "./IApplet";
import {postResource} from "../requester";
import Applet from "./Applet";
import AppletVersionManagement from "./Version/AppletVersionManagement";
import AppletCommandManagement from "./Command/AppletCommandManagement";
import AppletTestSuiteManagement from "./Version/AppletTestSuiteManagement";
import UnsupportedError from '../Error/UnsupportedError';
import wait from '../../Timer/wait';

export const RESOURCE: string = 'applet';

export default class AppletManagement {

	public command: AppletCommandManagement;
	public version: AppletVersionManagement;
	public tests: AppletTestSuiteManagement;

	private static getUrl(appletUid: string): string {
		return `${RESOURCE}/${appletUid}/`;
	}

	constructor(private options: IOptions) {
		this.command = new AppletCommandManagement(options);
		this.version = new AppletVersionManagement(options);
		this.tests = new AppletTestSuiteManagement(options);
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

	public async create(settings: IAppletCreatable): Promise<Applet> {
		this.assertV1();

		await postResource(this.options, RESOURCE, settings);
		// v1 does not respond created uid
		let applet: Applet | undefined;
		do {
			await wait(500);
			const applets = await this.list();
			applet = applets.find((a: Applet) => a.name === settings.name);
		} while (!applet);

		return applet;
	}

	public async delete(appletUid: string): Promise<void> {
		await deleteResource(this.options, AppletManagement.getUrl(appletUid));
	}

	private assertV1(): void {
		if (this.options.version !== 'v1') {
			throw new UnsupportedError(`API version ${this.options.version} is not implemented`);
		}
	}
}
