import { returnNullOn404 } from '../../../../Lib/request';
import IOptions from '../../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../../requester';
import {
	IRunnerVersionPlatform,
	IRunnerVersionPlatformCreatable,
	IRunnerVersionPlatformId,
	IRunnerVersionPlatformUpdatable,
} from './IRunnerVersionPlatform';
import { RunnerVersionPlatform } from './RunnerVersionPlatform';
import { RunnerVersionPlatformArchiveManagement } from './Archive/RunnerVersionPlatformArchiveManagement';
import { getUrl as getRunnerVersionUrl } from '../RunnerVersionManagement';

export function getUrl({ runnerUid, version, platform }: { runnerUid: string; version: string; platform?: string }): string {
	return `${getRunnerVersionUrl(runnerUid, version)}/platform${platform ? `/${platform}` : ''}`;
}

export class RunnerVersionPlatformManagement {
	public readonly archive: RunnerVersionPlatformArchiveManagement;

	constructor(private options: IOptions) {
		this.archive = new RunnerVersionPlatformArchiveManagement(options);
	}

	public async list({ runnerUid, version }: { runnerUid: string; version: string }): Promise<IRunnerVersionPlatform[]> {
		const url = getUrl({ runnerUid, version });
		const response = await getResource(this.options, url);
		const data: IRunnerVersionPlatform[] = await parseJSONResponse(response);
		return data.map((item: IRunnerVersionPlatform) => new RunnerVersionPlatform(item));
	}

	public async get(runnerVersionPlatformId: IRunnerVersionPlatformId): Promise<IRunnerVersionPlatform | null> {
		return await returnNullOn404(
			(async () => {
				const url = getUrl(runnerVersionPlatformId);
				const response = await getResource(this.options, url);
				return new RunnerVersionPlatform(await parseJSONResponse(response));
			})(),
		);
	}

	public async create({
		runnerUid,
		version,
		...data
	}: IRunnerVersionPlatformId & IRunnerVersionPlatformCreatable): Promise<IRunnerVersionPlatform> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl({ runnerUid, version });
		const response = await postResource(options, url, JSON.stringify(data));
		return new RunnerVersionPlatform(await parseJSONResponse(response));
	}

	public async update({
		runnerUid,
		version,
		platform,
		...data
	}: IRunnerVersionPlatformId & IRunnerVersionPlatformUpdatable): Promise<void> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl({ runnerUid, version, platform });
		await putResource(options, url, JSON.stringify(data));
	}

	public async delete(runnerVersionPlatformId: IRunnerVersionPlatformId): Promise<void> {
		const url = getUrl(runnerVersionPlatformId);
		await deleteResource(this.options, url);
	}
}
