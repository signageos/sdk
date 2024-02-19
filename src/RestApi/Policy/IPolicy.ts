export interface IPolicyCreatable {
	name: string;
	organizationUid: string;
}

export interface IPolicyUpdatable {
	name?: string;
	items?: IPolicyItem[];
	note?: string;
}

export interface IPolicyClonable {
	name: string;
	organizationUid: string;
}

export interface IPolicyItem {
	type: string;
	applicationType?: string;
	value: any;
	updatedAt?: Date;
}

export default interface IPolicy {
	uid: string;
	name: string;
	createdAt: Date;
	items: IPolicyItem[];
	note?: string;
}
