import { returnNullOn404 } from '../../Lib/request';
import IOptions from '../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { IRunner, IRunnerCreatable, IRunnernUpdatable, Runner } from './Runner';
import { RunnerVersionManagement } from './Version/RunnerVersionManagement';

export function getUrl(runnerUid?: string): string {
	const baseUrl = `plugin`;
	return runnerUid ? `${baseUrl}/${runnerUid}` : baseUrl;
}

export class RunnerManagement {
	public readonly version: RunnerVersionManagement;

	constructor(private options: IOptions) {
		this.version = new RunnerVersionManagement(options);
	}

	public async list(): Promise<IRunner[]> {
		const response = await getResource(this.options, getUrl());
		const data: IRunner[] = await parseJSONResponse(response);
		return data.map((item: IRunner) => new Runner(item));
	}

	public async get(runnerUid: string): Promise<IRunner | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.options, getUrl(runnerUid));
				return new Runner(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: IRunnerCreatable): Promise<IRunner> {
		const options = { ...this.options, followRedirects: true };
		const response = await postResource(options, getUrl(), JSON.stringify(data));
		return new Runner(await parseJSONResponse(response));
	}

	public async update(runnerUid: string, data: IRunnernUpdatable) {
		await putResource(this.options, getUrl(runnerUid), JSON.stringify(data));
	}

	public async delete(runnerUid: string) {
		await deleteResource(this.options, getUrl(runnerUid));
	}
}
