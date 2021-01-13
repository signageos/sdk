export interface IEmulatorCreatable {
	organizationUid: string;
}

export default interface IEmulator {
	uid: string;
	duid: string;
	name: string;
	createdAt: Date;
}
