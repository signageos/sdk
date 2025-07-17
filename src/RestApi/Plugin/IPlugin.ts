export interface IPlugin {
	uid: string;
	name: string;
	title: string;
	organizationUid: string;
	description?: string;
	tagUids?: string[];
	supportedPlatforms?: string[];
	latestVersion?: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: any;
	updatedBy?: any;
}

export type IPluginCreatable = Pick<IPlugin, 'name' | 'title' | 'description' | 'tagUids'> & {
	organizationUid?: string;
};
export type IPluginUpdatable = Partial<Pick<IPlugin, 'name' | 'title' | 'description' | 'tagUids'>>;
