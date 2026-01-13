import { ContentGuardItemType } from './ContentGuardItemType';

export interface IContentGuardItem {
	readonly uid: string;
	readonly itemType: ContentGuardItemType;
	readonly title: string;
	readonly description: string;
	readonly categoryUid: string;
	readonly tagUids: string[];
	readonly imageName?: string;
	readonly imageUploadFinished?: boolean;
	readonly prompt?: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export type IContentGuardItemCreatable = Pick<
	IContentGuardItem,
	'itemType' | 'title' | 'description' | 'categoryUid' | 'tagUids' | 'prompt'
>;
export type IContentGuardItemUpdatable = Partial<Pick<IContentGuardItem, 'title' | 'description' | 'categoryUid' | 'tagUids' | 'prompt'>>;
