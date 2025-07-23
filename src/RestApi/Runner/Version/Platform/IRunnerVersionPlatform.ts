export interface IRunnerVersionPlatform {
	/** Platform name (i.e. linux, tizen, webos,...) */
	platform: string;
	/** Script runtime (i.e. browser.js, node.js, bash,...) */
	runtime: string;
	/** URI where the archive with the script code can be downloaded */
	archiveUri: string;
	/** Checksum of the archive, that contains the script files */
	md5Checksum: string;
	/** Main file of the script that should be executed */
	mainFile: string;
}

export type IRunnerVersionPlatformId = Pick<IRunnerVersionPlatform, 'platform'>;
export type IRunnerVersionPlatformCreatable = Pick<IRunnerVersionPlatform, 'platform' | 'runtime' | 'mainFile'>;
export type IRunnerVersionPlatformUpdatable = Pick<IRunnerVersionPlatform, 'runtime' | 'mainFile'>;
