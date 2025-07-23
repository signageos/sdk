import { returnNullOn404 } from '../../../../Lib/request';
import IOptions from '../../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../../requester';
import { IRunnerVersionPlatform, IRunnerVersionPlatformCreatable, IRunnerVersionPlatformUpdatable } from './IRunnerVersionPlatform';
import { RunnerVersionPlatform } from './RunnerVersionPlatform';
import { RunnerVersionPlatformArchiveManagement } from './Archive/RunnerVersionPlatformArchiveManagement';

export function getUrl(runnerUid: string, version: string, platform?: string): string {
	const baseUrl = `runner/${runnerUid}/version/${version}/platform`;
	return platform ? `${baseUrl}/${platform}` : baseUrl;
}

export class RunnerVersionPlatformManagement {
	public readonly archive: RunnerVersionPlatformArchiveManagement;

	constructor(private options: IOptions) {
		this.archive = new RunnerVersionPlatformArchiveManagement(options);
	}

	public async list(runnerUid: string, version: string): Promise<IRunnerVersionPlatform[]> {
		const url = getUrl(runnerUid, version);
		const response = await getResource(this.options, url);
		const data: IRunnerVersionPlatform[] = await parseJSONResponse(response);
		return data.map((item: IRunnerVersionPlatform) => new RunnerVersionPlatform(item));
	}

	public async get(runnerUid: string, version: string, platform: string): Promise<IRunnerVersionPlatform | null> {
		const url = getUrl(runnerUid, version, platform);

		return returnNullOn404(
			(async () => {
				const response = await getResource(this.options, url);
				return new RunnerVersionPlatform(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(
		runnerUid: string,
		version: string,
		platform: string,
		data: IRunnerVersionPlatformCreatable,
	): Promise<IRunnerVersionPlatform> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl(runnerUid, version, platform);
		const response = await postResource(options, url, JSON.stringify(data));
		return new RunnerVersionPlatform(await parseJSONResponse(response));
	}

	public async update(
		runnerUid: string,
		version: string,
		platform: string,
		data: IRunnerVersionPlatformUpdatable,
	): Promise<IRunnerVersionPlatform> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl(runnerUid, version, platform);
		const response = await putResource(options, url, JSON.stringify(data));
		return new RunnerVersionPlatform(await parseJSONResponse(response));
	}

	public async delete(runnerUid: string, version: string, platform: string) {
		const url = getUrl(runnerUid, version, platform);
		await deleteResource(this.options, url);
	}
}
