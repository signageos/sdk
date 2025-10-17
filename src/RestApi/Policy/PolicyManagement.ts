import { Headers } from 'node-fetch';
import { getResource, parseJSONResponse, putResource, postResource } from '../requester';
import { Dependencies } from '../Dependencies';
import IPolicy, { IPolicyCreatable, IPolicyUpdatable, IPolicyClonable } from './IPolicy';
import Policy from './Policy';
import IPolicyFilter from './IPolicyFilter';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

export default class PolicyManagement {
	public static readonly RESOURCE: string = 'policy';

	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter: IPolicyFilter = {}): Promise<PaginatedList<Policy>> {
		const response = await getResource(this.dependencies.options, PolicyManagement.RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(response, (item: IPolicy) => new Policy(item));
	}

	public async get(policyUid: string): Promise<Policy> {
		const response = await getResource(this.dependencies.options, `${PolicyManagement.RESOURCE}/${policyUid}`);
		return new Policy(await parseJSONResponse(response));
	}

	public async create(settings: IPolicyCreatable): Promise<Policy> {
		const { headers } = await postResource(this.dependencies.options, PolicyManagement.RESOURCE, JSON.stringify(settings));
		return await this.extractLocationFromHeader(headers, "Api didn't return location header to created policy.");
	}

	public async set(policyUid: string, settings: IPolicyUpdatable): Promise<void> {
		await putResource(this.dependencies.options, `${PolicyManagement.RESOURCE}/${policyUid}`, JSON.stringify(settings));
	}

	public async clone(policyUid: string, settings: IPolicyClonable): Promise<Policy> {
		const { headers } = await putResource(
			this.dependencies.options,
			`${PolicyManagement.RESOURCE}/${policyUid}/clone`,
			JSON.stringify(settings),
		);
		return await this.extractLocationFromHeader(headers, "Api didn't return location header to cloned policy.");
	}

	public async archive(policyUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${PolicyManagement.RESOURCE}/${policyUid}/archive`, JSON.stringify({ archived: true }));
	}

	public async unarchive(policyUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${PolicyManagement.RESOURCE}/${policyUid}/archive`, JSON.stringify({ archived: false }));
	}

	private async extractLocationFromHeader(headers: Headers, message: string) {
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(message);
		}

		const policyUid = headerLocation.split('/').slice(-1)[0];
		return await this.get(policyUid);
	}
}
