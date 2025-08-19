import { fillDataToEntity } from '../../../mapper';
import { IRunnerVersionPlatform } from './IRunnerVersionPlatform';

export class RunnerVersionPlatform implements IRunnerVersionPlatform {
	public readonly runnerUid: IRunnerVersionPlatform['runnerUid'];
	public readonly version: IRunnerVersionPlatform['version'];
	public readonly platform: IRunnerVersionPlatform['platform'];
	public readonly runtime: IRunnerVersionPlatform['runtime'];
	public readonly archiveUri: IRunnerVersionPlatform['archiveUri'];
	public readonly md5Checksum: IRunnerVersionPlatform['md5Checksum'];
	public readonly mainFile: IRunnerVersionPlatform['mainFile'];

	constructor(data: IRunnerVersionPlatform) {
		fillDataToEntity(this, data);
	}
}
