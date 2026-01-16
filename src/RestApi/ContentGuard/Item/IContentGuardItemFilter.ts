import { ContentGuardItemType } from './ContentGuardItemType';

export interface IContentGuardItemFilter {
	readonly descending?: boolean;
	readonly limit?: number;
	readonly uids?: string[];
	readonly companyUid?: string;
	readonly organizationUids?: string[];
	readonly tagUids?: string[];
	readonly title?: string;
	readonly description?: string;
	readonly categoryUids?: string[];
	readonly itemType?: ContentGuardItemType;
	readonly sortKey?: 'createdAt';
}
