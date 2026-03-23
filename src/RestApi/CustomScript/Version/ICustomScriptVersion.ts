export interface ICustomScriptVersion {
	customScriptUid: string;
	version: string;
	configDefinition: any;
	jsApiVersion?: string;
}

export type ICustomScriptVersionId = Pick<ICustomScriptVersion, 'customScriptUid' | 'version'>;
export type ICustomScriptVersionCreatable = Pick<ICustomScriptVersion, 'configDefinition' | 'jsApiVersion'>;
export type ICustomScriptVersionUpdatable = Pick<ICustomScriptVersion, 'configDefinition' | 'jsApiVersion'>;
