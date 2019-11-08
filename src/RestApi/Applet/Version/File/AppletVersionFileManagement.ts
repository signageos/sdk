import * as path from 'path';
import {
	getResource,
	parseJSONResponse,
	postResource,
	putResource,
	deleteResource
} from "../../../requester";
import IOptions from "../../../IOptions";
import { RESOURCE as APPLET } from "../../AppletManagement";
import { RESOURCE as VERSION } from "../AppletVersionManagement";
import IAppletVersionFile, { IAppletVersionFileCreatable, IAppletVersionFileUpdatable } from "./IAppletVersionFile";
import AppletVersionFile from "./AppletVersionFile";
import {
	postStorage,
	parseStorageResponse,
	StorageResponse,
} from '../../../storageRequester';

export default class AppletVersionFileManagement {

	private static readonly RESOURCE: string = 'file';

	private static getResource(appletUid: string, appletVersion: string): string {
		return `${APPLET}/${appletUid}/${VERSION}/${appletVersion}/${AppletVersionFileManagement.RESOURCE}`;
	}

	private static getUrl(appletUid: string, appletVersion: string, filePath: string): string {
		return `${AppletVersionFileManagement.getResource(appletUid, appletVersion)}/${filePath}`;
	}

	constructor(private options: IOptions) {
	}

	public async list(appletUid: string, appletVersion: string): Promise<IAppletVersionFile[]> {
		const response = await getResource(this.options, AppletVersionFileManagement.getResource(appletUid, appletVersion));
		const data: IAppletVersionFile[] = await parseJSONResponse(response);

		return data.map((item: IAppletVersionFile) => new AppletVersionFile(item));
	}

	public async get(appletUid: string, appletVersion: string, filePath: string): Promise<IAppletVersionFile> {
		const response = await getResource(this.options, AppletVersionFileManagement.getUrl(appletUid, appletVersion, filePath));

		const storageResponse = await parseStorageResponse(
			response,
			{
				storage: 's3',
				parse: IAppletVersionFile,
			},
		) as StorageResponse.S3.IAppletVersionFile;

		const data: IAppletVersionFile = {
			...storageResponse,
			name: path.basename(filePath),
			path: filePath,
		};
		return new AppletVersionFile(data);
	}

	public async create(appletUid: string, appletVersion: string, settings: IAppletVersionFileCreatable): Promise<void> {
		const path = AppletVersionFileManagement.getResource(appletUid, appletVersion);

		const response = await postResource(this.options, path, JSON.stringify({
			...settings,
			content: undefined
		}));
		const body = await response.json();

		await postStorage(
			body.upload.request.url,
			body.upload.request.fields,
			settings.content,
		);
	}

	public async update(appletUid: string, appletVersion: string, filePath: string, settings: IAppletVersionFileUpdatable): Promise<void> {
		const path = AppletVersionFileManagement.getUrl(appletUid, appletVersion, filePath);

		const response = await putResource(this.options, path, JSON.stringify({
			...settings,
			content: undefined
		}));
		const body = await response.json();

		await postStorage(
			body.upload.request.url,
			body.upload.request.fields,
			settings.content,
		);
	}

	public async remove(appletUid: string, appletVersion: string, filePath: string): Promise<void> {
		const path = AppletVersionFileManagement.getUrl(appletUid, appletVersion, filePath);

		await deleteResource(this.options, path);
	}
}
