export interface IPlugin {
	uid: string;
	name: string;
	title: string;
	organizationUid: string;
	description?: string;
	tagUids?: string[];
	supportedPlatforms?: string[];
	latestVersion?: string;
}

export type IPluginCreatable = Pick<IPlugin, 'name' | 'title' | 'description' | 'tagUids'> & { organizationUid?: string };
export type IPluginUpdatable = Partial<Pick<IPlugin, 'name' | 'title' | 'description' | 'tagUids'>>;
