export interface ICustomScript {
	uid: string;
	name: string;
	title: string;
	description?: string;
	dangerLevel: string;
}

export type ICustomScriptCreatable = Pick<ICustomScript, 'name' | 'title' | 'description' | 'dangerLevel'> & { organizationUid?: string };
export type ICustomScriptUpdatable = Partial<Pick<ICustomScript, 'name' | 'title' | 'description' | 'dangerLevel'>>;

/** Managed (global) custom scripts have no owning organization. */
export type ICustomScriptManagedCreatable = Pick<ICustomScript, 'name' | 'title' | 'description' | 'dangerLevel'>;
