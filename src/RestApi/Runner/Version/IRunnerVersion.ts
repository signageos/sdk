export interface IRunnerVersion {
	runnerUid: string;
	version: string;
	configDefinition: any; // TODO
}

export type IRunnerVersionId = Pick<IRunnerVersion, 'runnerUid' | 'version'>;
export type IRunnerVersionCreatable = Pick<IRunnerVersion, 'configDefinition'>;
export type IRunnerVersionUpdatable = Pick<IRunnerVersion, 'configDefinition'>;
