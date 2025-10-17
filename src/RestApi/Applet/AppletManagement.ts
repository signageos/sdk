import * as path from 'path';
import { Dependencies } from '../Dependencies';
import { deleteResource, getResource, parseJSONResponse, postResource } from '../requester';
import Applet from './Applet';
import AppletCommandManagement from './Command/AppletCommandManagement';
import IApplet, { IAppletCreatable } from './IApplet';
import AppletTestSuiteManagement from './Version/AppletTestSuiteManagement';
import AppletVersionManagement from './Version/AppletVersionManagement';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

export const RESOURCE: string = 'applet';

export default class AppletManagement {
	public command: AppletCommandManagement;
	public version: AppletVersionManagement;
	public tests: AppletTestSuiteManagement;

	constructor(private readonly dependencies: Dependencies) {
		this.command = new AppletCommandManagement(dependencies);
		this.version = new AppletVersionManagement(dependencies.options);
		this.tests = new AppletTestSuiteManagement(dependencies.options);
	}

	public async list(): Promise<PaginatedList<Applet>> {
		const response = await getResource(this.dependencies.options, RESOURCE);
		return this.dependencies.paginator.getPaginatedListFromResponse(response, (item: IApplet) => new Applet(item));
	}

	public async get(appletUid: string): Promise<IApplet> {
		const response = await getResource(this.dependencies.options, AppletManagement.getUrl(appletUid));

		return new Applet(await parseJSONResponse(response));
	}

	public async create(settings: IAppletCreatable): Promise<Applet> {
		const { headers } = await postResource(this.dependencies.options, RESOURCE, JSON.stringify(settings));
		const headerLink = headers.get('link');

		if (!headerLink) {
			throw new Error(`Api didn't return link header to created ${RESOURCE}.`);
		}

		const appletUid = path.basename(headerLink.substr(1, headerLink.length - 2));
		const applet = this.get(appletUid);

		return applet;
	}

	public async delete(appletUid: string): Promise<void> {
		await deleteResource(this.dependencies.options, AppletManagement.getUrl(appletUid));
	}

	private static getUrl(appletUid: string): string {
		return `${RESOURCE}/${appletUid}/`;
	}
}
