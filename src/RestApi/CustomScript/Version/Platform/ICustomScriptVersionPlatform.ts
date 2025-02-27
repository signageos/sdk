export interface ICustomScriptVersionPlatform {
	customScriptUid: string;
	version: string;
	/** Platform name (i.e. linux, tizen, webos,...) */
	platform: string;
	/** Main file of the script that should be executed */
	mainFile: string;
	/** Script runtime (i.e. browser.js, node.js, bash,...) */
	runtime: string;
	/** Checksum of the archive, that contains the script files */
	md5Checksum: string;
	/** URI where the archive with the script code can be downloaded */
	archiveUri: string;
}

export type ICustomScriptVersionPlatformId = Pick<ICustomScriptVersionPlatform, 'customScriptUid' | 'version' | 'platform'>;
export type ICustomScriptVersionPlatformCreatable = Pick<ICustomScriptVersionPlatform, 'mainFile' | 'runtime' | 'md5Checksum'>;
export type ICustomScriptVersionPlatformUpdatable = Pick<ICustomScriptVersionPlatform, 'mainFile' | 'runtime' | 'md5Checksum'>;
