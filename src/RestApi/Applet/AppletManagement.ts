import * as path from 'path';
import IOptions from '../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource } from '../requester';
import Applet from './Applet';
import AppletCommandManagement from './Command/AppletCommandManagement';
import IApplet, { IAppletCreatable } from './IApplet';
import AppletTestSuiteManagement from './Version/AppletTestSuiteManagement';
import AppletVersionManagement from './Version/AppletVersionManagement';

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
		const { headers } = await postResource(this.options, RESOURCE, JSON.stringify(settings));
		const headerLink = headers.get('link');

		if (!headerLink) {
			throw new Error(`Api didn't return link header to created ${RESOURCE}.`);
		}

		const appletUid = path.basename(headerLink.substr(1, headerLink.length - 2));
		const applet = this.get(appletUid);

		return applet;
	}

	public async delete(appletUid: string): Promise<void> {
		await deleteResource(this.options, AppletManagement.getUrl(appletUid));
	}
}
