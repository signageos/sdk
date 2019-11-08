import { getResource, parseJSONResponse, postResource, putResource } from "../../requester";
import IOptions from "../../IOptions";
import { RESOURCE as APPLET } from "../AppletManagement";
import IAppletVersion, { IAppletVersionCreatable, IAppletVersionUpdatable } from "./IAppletVersion";
import AppletVersion from "./AppletVersion";
import IAppletVersionFilter, { IAppletVersionListFilter } from "./IAppletVersionFilter";
import AppletVersionFileManagement from "./File/AppletVersionFileManagement";

export const RESOURCE: string = 'version';

export default class AppletVersionManagement {

	public file: AppletVersionFileManagement;

	private static getResource(appletUid: string): string {
		return `${APPLET}/${appletUid}/${RESOURCE}/`;
	}

	private static getUrl(appletUid: string, version: string): string {
		return `${AppletVersionManagement.getResource(appletUid)}${version}/`;
	}

	constructor(private options: IOptions) {
		this.file = new AppletVersionFileManagement(options);
	}

	public async list(appletUid: string, filter: IAppletVersionListFilter = {}): Promise<IAppletVersion[]> {
		const response = await getResource(this.options, AppletVersionManagement.getResource(appletUid), filter);
		const data: IAppletVersion[] = await parseJSONResponse(response);

		return data.map((item: IAppletVersion) => new AppletVersion(item));
	}

	public async get(appletUid: string, version: string, filter: IAppletVersionFilter = {}): Promise<IAppletVersion> {
		const response = await getResource(this.options, AppletVersionManagement.getUrl(appletUid, version), filter);

		return new AppletVersion(await parseJSONResponse(response));
	}

	public async create(appletUid: string, settings: IAppletVersionCreatable): Promise<void> {
		const contentType = settings.entryFile ? 'application/json' : 'text/html';
		const options: IOptions = {
			...this.options,
			contentType,
		};

		const versionParam = `version=${settings.version}`;
		const frontAppletVersionParam = `frontAppletVersion=${settings.frontAppletVersion}`;

		const pathWithoutParameters = AppletVersionManagement.getResource(appletUid);
		const pathWithParameters = `${pathWithoutParameters}?${frontAppletVersionParam}&${versionParam}`;
		const path = settings.entryFile ? pathWithoutParameters : pathWithParameters;

		const data = settings.entryFile ? JSON.stringify(settings) : settings.binary;

		await postResource(options, path, data);
	}

	public async update(appletUid: string, version: string, settings: IAppletVersionUpdatable): Promise<void> {
		const contentType = settings.entryFile ? 'application/json' : 'text/html';
		const options: IOptions = {
			...this.options,
			contentType,
		};

		const frontAppletVersionParam = `frontAppletVersion=${settings.frontAppletVersion}`;

		const pathWithoutParameters = AppletVersionManagement.getUrl(appletUid, version);
		const pathWithParameters = `${pathWithoutParameters}?${frontAppletVersionParam}`;
		const path = settings.entryFile ? pathWithoutParameters : pathWithParameters;

		const data = settings.entryFile ? JSON.stringify(settings) : settings.binary;

		await putResource(options, path, data);
	}

}
