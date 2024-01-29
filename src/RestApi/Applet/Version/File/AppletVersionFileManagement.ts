import * as path from 'path';
import { getResource, parseJSONResponse, postResource, putResource, deleteResource } from '../../../requester';
import IOptions from '../../../IOptions';
import { RESOURCE as APPLET } from '../../AppletManagement';
import { RESOURCE as VERSION } from '../AppletVersionManagement';
import IAppletVersionFile, { IAppletVersionFileCreatable, IAppletVersionFileUpdatable } from './IAppletVersionFile';
import AppletVersionFile from './AppletVersionFile';
import { postStorage, parseStorageResponse, StorageResponse } from '../../../storageRequester';

interface IUploadOptions {
	/**
	 * Defines whether the uploading of the file invokes building applet or not.
	 * Default is true.
	 * However, the true is only for backward compatibility.
	 * It's better to use false and build applet only when last file is uploaded using AppletManagement.update()
	 */
	build?: boolean;
}

export default class AppletVersionFileManagement {
	private static readonly RESOURCE: string = 'file';

	private static getResource(appletUid: string, appletVersion: string): string {
		return `${APPLET}/${appletUid}/${VERSION}/${appletVersion}/${AppletVersionFileManagement.RESOURCE}`;
	}

	private static getUrl(appletUid: string, appletVersion: string, filePath: string): string {
		return `${AppletVersionFileManagement.getResource(appletUid, appletVersion)}/${filePath}`;
	}

	constructor(private options: IOptions) {}

	public async list(appletUid: string, appletVersion: string): Promise<IAppletVersionFile[]> {
		const response = await getResource(this.options, AppletVersionFileManagement.getResource(appletUid, appletVersion));
		const data: IAppletVersionFile[] = await parseJSONResponse(response);

		return data.map((item: IAppletVersionFile) => new AppletVersionFile(item));
	}

	public async get(appletUid: string, appletVersion: string, filePath: string): Promise<IAppletVersionFile> {
		const response = await getResource(this.options, AppletVersionFileManagement.getUrl(appletUid, appletVersion, filePath));

		const storageResponse = (await parseStorageResponse(response, {
			storage: 's3',
			parse: IAppletVersionFile,
		})) as StorageResponse.S3.AppletVersionFile;

		const data: IAppletVersionFile = {
			...storageResponse,
			name: path.basename(filePath),
			path: filePath,
		};
		return new AppletVersionFile(data);
	}

	public async create(
		appletUid: string,
		appletVersion: string,
		settings: IAppletVersionFileCreatable,
		options: IUploadOptions = {},
	): Promise<void> {
		const appletVersionPath = AppletVersionFileManagement.getResource(appletUid, appletVersion);

		const reqBody = {
			...settings,
			content: undefined,
			size: undefined,
		};
		const response = await postResource(this.options, appletVersionPath, JSON.stringify(reqBody), options);
		const body = await response.json();

		await postStorage(body.upload.request.url, body.upload.request.fields, settings.content, settings.size);
	}

	public async update(
		appletUid: string,
		appletVersion: string,
		filePath: string,
		settings: IAppletVersionFileUpdatable,
		options: IUploadOptions = {},
	): Promise<void> {
		const appletVersionPath = AppletVersionFileManagement.getUrl(appletUid, appletVersion, filePath);

		const reqBody = {
			...settings,
			content: undefined,
			size: undefined,
		};
		const response = await putResource(this.options, appletVersionPath, JSON.stringify(reqBody), options);
		const body = await response.json();

		await postStorage(body.upload.request.url, body.upload.request.fields, settings.content, settings.size);
	}

	public async remove(appletUid: string, appletVersion: string, filePath: string, options: IUploadOptions = {}): Promise<void> {
		const appletVersionPath = AppletVersionFileManagement.getUrl(appletUid, appletVersion, filePath);

		await deleteResource(this.options, appletVersionPath, options);
	}
}
