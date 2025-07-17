import { fillDataToEntity } from '../../mapper';
import { IRunnerVersion } from './IRunnerVersion';

export class RunnerVersion implements IRunnerVersion {
	public readonly runnerUid: IRunnerVersion['runnerUid'];
	public readonly version: IRunnerVersion['version'];
	public readonly configDefinition: IRunnerVersion['configDefinition'];

	constructor(data: IRunnerVersion) {
		fillDataToEntity(this, data);
	}
}
