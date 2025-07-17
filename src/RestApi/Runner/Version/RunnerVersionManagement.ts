import { returnNullOn404 } from '../../../Lib/request';
import IOptions from '../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { IRunnerVersion, IRunnerVersionCreatable, IRunnerVersionUpdatable } from './IRunnerVersion';
import { RunnerVersion } from './RunnerVersion';

export function getUrl(runnerUid: string, version?: string): string {
	const baseUrl = `${getUrl(runnerUid)}/version`;
	return version ? `${baseUrl}/${version}` : baseUrl;
}

export class RunnerVersionManagement {
	public readonly platform: RunnerVersionManagement;

	constructor(private options: IOptions) {
		this.platform = new RunnerVersionManagement(options);
	}

	public async list(runnerUid: string): Promise<IRunnerVersion[]> {
		const url = getUrl(runnerUid);
		const response = await getResource(this.options, url);
		const data: IRunnerVersion[] = await parseJSONResponse(response);
		return data.map((item: IRunnerVersion) => new RunnerVersion(item));
	}

	public async get({ runnerUid, version }: IRunnerVersion): Promise<IRunnerVersion | null> {
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
		await putResource(this.options, url, JSON.stringify(data));
	}

	public async delete({ runnerUid, version }: IRunnerVersion) {
		const url = getUrl(runnerUid, version);
		await deleteResource(this.options, url);
	}
}
