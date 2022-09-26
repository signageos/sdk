import { getResource, parseJSONResponse, postResource, putResource } from '../requester';
import IOptions from '../IOptions';
import BulkOperation from './BulkOperation';
import IBulkOperation, { IBulkOperationCreatable, IBulkOperationFilter } from './IBulkOperation';
import { DeviceActionType } from './enums';
import { Headers } from 'node-fetch';
import { IRollingUpdate } from './types';

export default class BulkOperationManagement {
	public static readonly RESOURCE: string = 'bulk-operation';

	constructor(private options: IOptions) {
	}

	public async get(bulkOperationUid: string): Promise<BulkOperation> {
		const response = await getResource(this.options, `${BulkOperationManagement.RESOURCE}/${bulkOperationUid}`);
		return new BulkOperation(await parseJSONResponse(response));
	}

	public async list(filter: IBulkOperationFilter): Promise<BulkOperation[]> {
		const response = await getResource(this.options, `${BulkOperationManagement.RESOURCE}`, filter);
		const data: IBulkOperation<DeviceActionType>[] = await parseJSONResponse(response);
		return data.map((item: IBulkOperation<DeviceActionType>) => new BulkOperation(item));
	}

	public async create(bulkOperation: IBulkOperationCreatable<DeviceActionType>): Promise<BulkOperation> {
		const { headers } = await postResource(this.options, BulkOperationManagement.RESOURCE, JSON.stringify(bulkOperation));
		return await this.extractLocationFromHeader(headers, "Api didn't return location header to created bulk operation.");
	}

	public async stop(bulkOperationUid: string): Promise<void> {
		await putResource(this.options, `${BulkOperationManagement.RESOURCE}/${bulkOperationUid}/stop`, JSON.stringify({}));
	}

	public async pause(bulkOperationUid: string): Promise<void> {
		await putResource(this.options, `${BulkOperationManagement.RESOURCE}/${bulkOperationUid}/pause`, JSON.stringify({}));
	}

	public async resume(bulkOperationUid: string, rollingUpdate?: { rollingUpdate: IRollingUpdate }): Promise<void> {
		await putResource(this.options, `${BulkOperationManagement.RESOURCE}/${bulkOperationUid}/resume`, JSON.stringify(rollingUpdate));
	}

	public async archive(bulkOperationUid: string): Promise<void> {
		await putResource(this.options, `${BulkOperationManagement.RESOURCE}/${bulkOperationUid}/archive`, JSON.stringify({}));
	}

	private async extractLocationFromHeader(headers: Headers, message: string) {
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(message);
		}

		const resourceUid = headerLocation.split('/').slice(-1)[0];
		return await this.get(resourceUid);
	}
}
