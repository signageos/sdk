export interface IContentGuardCategory {
	readonly uid: string;
	readonly title: string;
	readonly organizationUid: string;
	readonly valid: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export type IContentGuardCategoryCreatable = Pick<IContentGuardCategory, 'title' | 'valid' | 'organizationUid'>;
export type IContentGuardCategoryUpdatable = Partial<Pick<IContentGuardCategory, 'title' | 'valid'>>;
