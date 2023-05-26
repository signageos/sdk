export interface IEmulatorCreatable {
	organizationUid: string;
	provision?: boolean;
}

export default interface IEmulator {
	uid: string;
	duid: string;
	name: string;
	createdAt: Date;
}
