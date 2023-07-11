export interface IEmulatorCreatable {
	organizationUid: string;
	skipProvision?: boolean;
}

export default interface IEmulator {
	uid: string;
	duid: string;
	name: string;
	createdAt: Date;
}
