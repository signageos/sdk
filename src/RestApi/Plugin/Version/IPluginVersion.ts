export interface IPluginVersion {
	pluginUid: string;
	version: string;
	configDefinition: any; // TODO
}

export type IPluginVersionId = Pick<IPluginVersion, 'pluginUid' | 'version'>;
export type IPluginVersionCreatable = Pick<IPluginVersion, 'configDefinition'>;
export type IPluginVersionUpdatable = Pick<IPluginVersion, 'configDefinition'>;
