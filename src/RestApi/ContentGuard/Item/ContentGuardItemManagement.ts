import { returnNullOn404 } from '../../../Lib/request';
import { Dependencies } from '../../Dependencies';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { ContentGuardItem } from './ContentGuardItem';
import { IContentGuardItem, IContentGuardItemCreatable, IContentGuardItemUpdatable } from './IContentGuardItem';
import { IContentGuardItemFilter } from './IContentGuardItemFilter';

const RESOURCE = 'content-guard/item';

export function getUrl(itemUid?: string): string {
	return itemUid ? `${RESOURCE}/${itemUid}` : RESOURCE;
}

export interface IImageUploadStartResponse {
	readonly upload: {
		readonly request: {
			readonly url: string;
			readonly fields: Readonly<Record<string, string>>;
		};
	};
	readonly file: {
		readonly url: string;
	};
	readonly imageName: string;
}

export class ContentGuardItemManagement {
	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter: IContentGuardItemFilter = {}): Promise<ContentGuardItem[]> {
		const response = await getResource(this.dependencies.options, getUrl(), filter);
		const data: IContentGuardItem[] = await parseJSONResponse(response);
		return data.map((item: IContentGuardItem) => new ContentGuardItem(item));
	}

	public async get(itemUid: string): Promise<ContentGuardItem | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.dependencies.options, getUrl(itemUid));
				return new ContentGuardItem(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: IContentGuardItemCreatable): Promise<{ uid: string }> {
		const options = { ...this.dependencies.options, followRedirects: true };
		const response = await postResource(options, getUrl(), JSON.stringify(data));
		return await parseJSONResponse(response);
	}

	public async update(itemUid: string, data: IContentGuardItemUpdatable): Promise<void> {
		await putResource(this.dependencies.options, getUrl(itemUid), JSON.stringify(data));
	}

	public async delete(itemUid: string): Promise<void> {
		await deleteResource(this.dependencies.options, getUrl(itemUid));
	}

	public async count(filter: Omit<IContentGuardItemFilter, 'descending' | 'limit' | 'sortKey'> = {}): Promise<number> {
		const response = await getResource(this.dependencies.options, `${RESOURCE}/count`, filter);
		const data = await parseJSONResponse(response);
		return data.count;
	}

	public async bulkUpdateCategory(uids: string[], categoryUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/bulk`, JSON.stringify({ uids, categoryUid }));
	}

	public async bulkDelete(uids: string[]): Promise<void> {
		await deleteResource(this.dependencies.options, `${RESOURCE}/bulk`, { uids });
	}

	public async startImageUpload(
		itemUid: string,
		data: { type: 'image/jpeg' | 'image/png'; md5Checksum: string },
	): Promise<IImageUploadStartResponse> {
		const response = await postResource(this.dependencies.options, `${getUrl(itemUid)}/image-upload`, JSON.stringify(data));
		return await parseJSONResponse(response);
	}

	public async finishImageUpload(itemUid: string, imageName: string): Promise<void> {
		await postResource(this.dependencies.options, `${getUrl(itemUid)}/image-upload/finish`, JSON.stringify({ imageName }));
	}
}
