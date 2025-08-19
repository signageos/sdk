export interface IPluginVersion {
	pluginUid: string;
	version: string;
	configDefinition?: any;
	schema?: any;
	jsApiVersion?: string;
	description?: string;
}

export type IPluginVersionId = Pick<IPluginVersion, 'pluginUid' | 'version'>;
export type IPluginVersionCreatable = Pick<IPluginVersion, 'configDefinition' | 'schema' | 'jsApiVersion' | 'description'>;
export type IPluginVersionUpdatable = Partial<Pick<IPluginVersion, 'configDefinition' | 'schema' | 'jsApiVersion' | 'description'>>;
