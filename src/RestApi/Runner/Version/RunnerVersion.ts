import { fillDataToEntity } from '../../mapper';
import { IRunnerVersion } from './IRunnerVersion';

export class RunnerVersion implements IRunnerVersion {
	public readonly uid: IRunnerVersion['uid'];
	public readonly runnerUid: IRunnerVersion['runnerUid'];
	public readonly version: IRunnerVersion['version'];
	public readonly configDefinition: IRunnerVersion['configDefinition'];
	public readonly input: IRunnerVersion['input'];
	public readonly output: IRunnerVersion['output'];
	public readonly telemetry?: IRunnerVersion['telemetry'];
	public readonly jsApiVersion?: IRunnerVersion['jsApiVersion'];
	public readonly description: IRunnerVersion['description'];

	constructor(data: IRunnerVersion) {
		fillDataToEntity(this, data);
	}
}
