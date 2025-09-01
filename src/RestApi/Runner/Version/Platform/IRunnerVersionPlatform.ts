export interface IRunnerVersionPlatform {
	runnerUid: string;
	version: string;
	/** Platform name (i.e. linux, tizen, webos,...) */
	platform: string;
	/** Script runtime. Valid values: 'ps1' | 'bash' | 'sh' | 'nodejs' | 'browser' | 'brs' */
	runtime: string;
	/** URI where the archive with the script code can be downloaded */
	archiveUri: string;
	/** Checksum of the archive, that contains the script files */
	md5Checksum: string;
	/** Main file of the script that should be executed */
	mainFile: string;
}

export type IRunnerVersionPlatformId = Pick<IRunnerVersionPlatform, 'runnerUid' | 'version' | 'platform'>;
export type IRunnerVersionPlatformCreatable = Pick<IRunnerVersionPlatform, 'platform' | 'runtime' | 'mainFile' | 'md5Checksum'>;
export type IRunnerVersionPlatformUpdatable = Pick<IRunnerVersionPlatform, 'runtime' | 'mainFile' | 'md5Checksum'>;
