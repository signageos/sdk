import IOptions from '../IOptions';
import { getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { IPackage, IPackageCreatable, IPackageUpdatable } from './IPackage';
import Package from './Package';
import { Headers } from 'node-fetch';
import IPackageFilter from './IPackageFilter';

export default class PackageManagement {
	public static readonly RESOURCE: string = 'package';

	constructor(private options: IOptions) {}

	public async list(filter: IPackageFilter): Promise<IPackage[]> {
		const response = await getResource(this.options, PackageManagement.RESOURCE, filter);
		const data: IPackage[] = await parseJSONResponse(response);
		return data.map((item: IPackage) => new Package(item));
	}

	public async get(packageUid: string): Promise<IPackage> {
		const response = await getResource(this.options, `${PackageManagement.RESOURCE}/${packageUid}`);
		return new Package(await parseJSONResponse(response));
	}

	public async create(packageObject: IPackageCreatable): Promise<IPackage> {
		const response = await postResource(this.options, PackageManagement.RESOURCE, JSON.stringify(packageObject));
		return this.extractLocationFromHeader(response.headers, "Api didn't return location header to created package.");
	}

	public async update(packageUid: string, packageObject: IPackageUpdatable): Promise<IPackage> {
		const response = await putResource(this.options, `${PackageManagement.RESOURCE}/${packageUid}`, JSON.stringify(packageObject));
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
