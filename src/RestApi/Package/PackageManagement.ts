import { getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { IPackage, IPackageCreatable, IPackageUpdatable } from './IPackage';
import Package from './Package';
import { Headers } from 'node-fetch';
import IPackageFilter from './IPackageFilter';
import { Dependencies } from '../Dependencies';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

export default class PackageManagement {
	public static readonly RESOURCE: string = 'package';

	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter: IPackageFilter): Promise<PaginatedList<Package>> {
		const response = await getResource(this.dependencies.options, PackageManagement.RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(response, (item: IPackage) => new Package(item));
	}

	public async get(packageUid: string): Promise<IPackage> {
		const response = await getResource(this.dependencies.options, `${PackageManagement.RESOURCE}/${packageUid}`);
		return new Package(await parseJSONResponse(response));
	}

	public async create(packageObject: IPackageCreatable): Promise<IPackage> {
		const response = await postResource(this.dependencies.options, PackageManagement.RESOURCE, JSON.stringify(packageObject));
		return this.extractLocationFromHeader(response.headers, "Api didn't return location header to created package.");
	}

	public async update(packageUid: string, packageObject: IPackageUpdatable): Promise<IPackage> {
		const response = await putResource(
			this.dependencies.options,
			`${PackageManagement.RESOURCE}/${packageUid}`,
			JSON.stringify(packageObject),
		);
		return this.extractLocationFromHeader(response.headers, "Api didn't return location header to created package.");
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
