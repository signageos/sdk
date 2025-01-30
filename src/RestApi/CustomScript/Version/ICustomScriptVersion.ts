export interface ICustomScriptVersion {
	customScriptUid: string;
	version: string;
	configDefinition: any; // TODO
}

export type ICustomScriptVersionId = Pick<ICustomScriptVersion, 'customScriptUid' | 'version'>;
export type ICustomScriptVersionCreatable = Pick<ICustomScriptVersion, 'configDefinition'>;
export type ICustomScriptVersionUpdatable = Pick<ICustomScriptVersion, 'configDefinition'>;
