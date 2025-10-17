export interface IEmulatorFilter {
	/** @deprecated Use organizationUids instead */
	organizationUid?: string;
	organizationUids?: string[];
	uids?: string[];
	limit?: number;
	descending?: boolean;
	createdUntil?: string;
}
