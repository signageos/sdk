import { getResource, parseJSONResponse, putResource, postResource } from '../../requester';
import IFirmwareVersion, { IFirmwareVersionUpdatable, IFirmwareVersionCreatable, IFile } from './IFirmwareVersion';
import IOptions from '../../IOptions';
import FirmwareVersion from './FirmwareVersion';
import { postStorage } from '../../storageRequester';
import * as _ from 'lodash';

export default class FirmwareVersionManagement {
	public static readonly RESOURCE: string = 'firmware/version';

	private static getUrl(applicationType: string, version: string, type: string | undefined): string {
		return `${FirmwareVersionManagement.RESOURCE}/${applicationType}/${version}${type ? '/' + type : ''}`;
	}

	constructor(private options: IOptions) {}

	public async list(): Promise<IFirmwareVersion[]> {
		const response = await getResource(this.options, FirmwareVersionManagement.RESOURCE);
		const data: IFirmwareVersion[] = await parseJSONResponse(response);

		return data.map((item: IFirmwareVersion) => new FirmwareVersion(item));
	}

	/**
	 * Finalize the uploaded firmware with settings uploaded: true.
	 * This method has to be called when successfully FW uploaded files to S3.
	 * @param force is applicable when FW cannot be uploaded because of non-existent firmware type.
	 * @deprecated Use create method instead. It does the confirmation automatically under the hood.
	 * TODO make this method private in the next major release.
	 */
	public async set(
		applicationType: string,
		version: string,
		type: string | undefined,
		settings: IFirmwareVersionUpdatable,
		force: boolean = false,
	): Promise<void> {
		await putResource(
			this.options,
			FirmwareVersionManagement.getUrl(applicationType, version, type),
			JSON.stringify(settings),
			force ? { force } : {},
		);
	}

	/**
	 * Initiate uploading of firmware files to S3 storage. If successfully uploaded, create FW version in DB.
	 * @param force is applicable when FW cannot be uploaded because of non-existent firmware type.
	 */
	public async create(settings: IFirmwareVersionCreatable, force: boolean = false): Promise<void> {
		const response = await postResource(
			this.options,
			FirmwareVersionManagement.RESOURCE,
			JSON.stringify({
				applicationType: settings.applicationType,
				version: settings.version,
				type: settings.type,
				hashes: settings.files.map((file: IFile) => file.hash),
			}),
			force ? { force } : {},
		);

		const bodyArr = await response.json();

		await Promise.all(
			bodyArr.map((bodyItem: any) => {
				const file = _.find(settings.files, (item: IFile) => item.hash === bodyItem.upload.request.fields['Content-MD5']);
				if (!file) {
					throw new Error('File not found');
				}
				return postStorage(bodyItem.upload.request.url, bodyItem.upload.request.fields, file.content, file.size);
			}),
		);

		await this.set(settings.applicationType, settings.version, settings.type, { uploaded: true }, force);
	}
}
