export interface IPackage {
	uid: string;
	createdAt: Date;
	packageName: string;
	label: string;
	description: string | undefined;
	ownerOrganizationUid: string;
	createdByAccountId: number | undefined;
}

export interface IPackageCreatable extends IPackageUpdatable {
	packageName: string;
}

export interface IPackageUpdatable {
	label: string;
	description: string | undefined;
}
