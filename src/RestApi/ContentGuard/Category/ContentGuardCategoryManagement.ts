import { returnNullOn404 } from '../../../Lib/request';
import { Dependencies } from '../../Dependencies';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { ContentGuardCategory } from './ContentGuardCategory';
import { IContentGuardCategory, IContentGuardCategoryCreatable, IContentGuardCategoryUpdatable } from './IContentGuardCategory';
import { IContentGuardCategoryFilter } from './IContentGuardCategoryFilter';

const RESOURCE = 'content-guard/category';

export function getUrl(categoryUid?: string): string {
	return categoryUid ? `${RESOURCE}/${categoryUid}` : RESOURCE;
}

export class ContentGuardCategoryManagement {
	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter: IContentGuardCategoryFilter = {}): Promise<ContentGuardCategory[]> {
		const response = await getResource(this.dependencies.options, getUrl(), filter);
		const data: IContentGuardCategory[] = await parseJSONResponse(response);
		return data.map((item: IContentGuardCategory) => new ContentGuardCategory(item));
	}

	public async get(categoryUid: string): Promise<ContentGuardCategory | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.dependencies.options, getUrl(categoryUid));
				return new ContentGuardCategory(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: IContentGuardCategoryCreatable): Promise<ContentGuardCategory> {
		const options = { ...this.dependencies.options, followRedirects: true };
		const response = await postResource(options, getUrl(), JSON.stringify(data));
		return new ContentGuardCategory(await parseJSONResponse(response));
	}

	public async update(categoryUid: string, data: IContentGuardCategoryUpdatable): Promise<void> {
		await putResource(this.dependencies.options, getUrl(categoryUid), JSON.stringify(data));
	}

	public async delete(categoryUid: string, options?: { deleteItems?: boolean }): Promise<void> {
		await deleteResource(this.dependencies.options, getUrl(categoryUid), options);
	}

	public async count(filter: Omit<IContentGuardCategoryFilter, 'descending' | 'limit' | 'sortKey'> = {}): Promise<number> {
		const response = await getResource(this.dependencies.options, `${RESOURCE}/count`, filter);
		const data = await parseJSONResponse(response);
		return data.count;
	}
}
