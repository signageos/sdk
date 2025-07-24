export interface IRunnerVersion {
	runnerUid: string;
	version: string;
	configDefinition: any;
	input: any;
	output: any;
	telemetry?: any;
	jsApiVersion?: string;
	description: string;
}

export type IRunnerVersionId = Pick<IRunnerVersion, 'runnerUid' | 'version'>;
export type IRunnerVersionCreatable = Pick<
	IRunnerVersion,
	'configDefinition' | 'input' | 'output' | 'telemetry' | 'jsApiVersion' | 'description'
>;
export type IRunnerVersionUpdatable = Partial<
	Pick<IRunnerVersion, 'configDefinition' | 'input' | 'output' | 'telemetry' | 'jsApiVersion' | 'description'>
>;
