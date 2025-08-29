import { returnNullOn404 } from '../../../Lib/request';
import IOptions from '../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { IRunnerVersion, IRunnerVersionCreatable, IRunnerVersionId, IRunnerVersionUpdatable } from './IRunnerVersion';
import { RunnerVersionPlatformManagement } from './Platform/RunnerVersionPlatformManagement';
import { RunnerVersion } from './RunnerVersion';
import { getUrl as getRunnerUrl } from '../RunnerManagement';

export function getUrl(runnerUid: string, version?: string): string {
	const baseUrl = `${getRunnerUrl(runnerUid)}/version`;
	return version ? `${baseUrl}/${version}` : baseUrl;
}

export class RunnerVersionManagement {
	public readonly platform: RunnerVersionPlatformManagement;

	constructor(private options: IOptions) {
		this.platform = new RunnerVersionPlatformManagement(options);
	}

	public async list(runnerUid: string): Promise<IRunnerVersion[]> {
		const url = getUrl(runnerUid);
		const response = await getResource(this.options, url);
		const data: IRunnerVersion[] = await parseJSONResponse(response);
		return data.map((item: IRunnerVersion) => new RunnerVersion(item));
	}

	public async get({ runnerUid, version }: IRunnerVersionId): Promise<IRunnerVersion | null> {
		const url = getUrl(runnerUid, version);

		return returnNullOn404(
			(async () => {
				const response = await getResource(this.options, url);
				return new RunnerVersion(await parseJSONResponse(response));
			})(),
		);
	}

	public async create({ runnerUid, ...data }: IRunnerVersion & IRunnerVersionCreatable): Promise<IRunnerVersion> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl(runnerUid);
		const response = await postResource(options, url, JSON.stringify(data));
		return new RunnerVersion(await parseJSONResponse(response));
	}

	public async update({ runnerUid, version, ...data }: IRunnerVersion & IRunnerVersionUpdatable) {
		const url = getUrl(runnerUid, version);
		// Only send fields that the API accepts for runner version update
		const allowedFields = {
			...(data.configDefinition && { configDefinition: data.configDefinition }),
			...(data.jsApiVersion && { jsApiVersion: data.jsApiVersion }),
		};
		await putResource(this.options, url, JSON.stringify(allowedFields));
	}

	public async delete({ runnerUid, version }: IRunnerVersionId): Promise<void> {
		const url = getUrl(runnerUid, version);
		await deleteResource(this.options, url);
	}
}
