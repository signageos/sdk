export interface IPluginVersion {
	pluginUid: string;
	version: string;
	configDefinition?: any;
	input?: any;
	output?: any;
	jsApiVersion?: string;
	description?: string;
}

export type IPluginVersionId = Pick<IPluginVersion, 'pluginUid' | 'version'>;
export type IPluginVersionCreatable = Pick<IPluginVersion, 'configDefinition' | 'input' | 'output' | 'jsApiVersion' | 'description'>;
export type IPluginVersionUpdatable = Partial<
	Pick<IPluginVersion, 'configDefinition' | 'input' | 'output' | 'jsApiVersion' | 'description'>
>;
