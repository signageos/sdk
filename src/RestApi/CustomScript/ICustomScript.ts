export interface ICustomScript {
	uid: string;
	name: string;
	title: string;
	description?: string;
	dangerLevel: string;
}

export type ICustomScriptCreatable = Pick<ICustomScript, 'name' | 'title' | 'description' | 'dangerLevel'> & { organizationUid?: string };
export type ICustomScriptUpdatable = Partial<Pick<ICustomScript, 'name' | 'title' | 'description' | 'dangerLevel'>>;
