export interface IPluginVersionPlatform {
	pluginUid: string;
	version: string;
	/** Platform name (i.e. linux, tizen, webos,...) */
	platform: string;
	/** Main file of the script that should be executed */
	mainFile: string;
	/** Script runtime. Valid values: 'ps1' | 'bash' | 'sh' | 'nodejs' | 'browser' | 'brs' */
	runtime: string;
	/** Checksum of the archive, that contains the script files */
	md5Checksum: string;
	/** URI where the archive with the script code can be downloaded */
	archiveUri: string;
}

export type IPluginVersionPlatformId = Pick<IPluginVersionPlatform, 'pluginUid' | 'version' | 'platform'>;
export type IPluginVersionPlatformCreatable = Pick<IPluginVersionPlatform, 'platform' | 'runtime' | 'mainFile' | 'md5Checksum'>;
export type IPluginVersionPlatformUpdatable = Pick<IPluginVersionPlatform, 'runtime' | 'mainFile' | 'md5Checksum'>;
