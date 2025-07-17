export interface IPlugin {
	uid: string;
	name: string;
	title: string;
	description?: string;
}

export type IPluginCreatable = Pick<IPlugin, 'name' | 'title' | 'description'>;
export type IPluginUpdatable = Partial<Pick<IPlugin, 'name' | 'title' | 'description' >>;
