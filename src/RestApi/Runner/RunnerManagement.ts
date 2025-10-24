import { returnNullOn404 } from '../../Lib/request';
import { Dependencies } from '../Dependencies';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { IRunner, IRunnerCreatable, IRunnerUpdatable, Runner } from './Runner';
import { RunnerVersionManagement } from './Version/RunnerVersionManagement';

export function getUrl(runnerUid?: string): string {
	const baseUrl = `runner`;
	return runnerUid ? `${baseUrl}/${runnerUid}` : baseUrl;
}

export class RunnerManagement {
	public readonly version: RunnerVersionManagement;

	constructor(private readonly dependencies: Dependencies) {
		this.version = new RunnerVersionManagement(dependencies.options);
	}

	public async list(): Promise<IRunner[]> {
		const response = await getResource(this.dependencies.options, getUrl());
		const data: IRunner[] = await parseJSONResponse(response);
		return data.map((item: IRunner) => new Runner(item));
	}

	public async get(runnerUid: string): Promise<IRunner | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.dependencies.options, getUrl(runnerUid));
				return new Runner(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: IRunnerCreatable): Promise<IRunner> {
		const options = { ...this.dependencies.options, followRedirects: true };

		const response = await postResource(options, getUrl(), JSON.stringify(data));
		return new Runner(await parseJSONResponse(response));
	}

	public async update(runnerUid: string, data: IRunnerUpdatable) {
		await putResource(this.dependencies.options, getUrl(runnerUid), JSON.stringify(data));
	}

	public async delete(runnerUid: string) {
		await deleteResource(this.dependencies.options, getUrl(runnerUid));
	}
}
