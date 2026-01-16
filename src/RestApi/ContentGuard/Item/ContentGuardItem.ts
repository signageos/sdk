import { fillDataToEntity } from '../../mapper';
import { IContentGuardItem } from './IContentGuardItem';

export class ContentGuardItem implements IContentGuardItem {
	public readonly uid: IContentGuardItem['uid'];
	public readonly itemType: IContentGuardItem['itemType'];
	public readonly title: IContentGuardItem['title'];
	public readonly description: IContentGuardItem['description'];
	public readonly categoryUid: IContentGuardItem['categoryUid'];
	public readonly tagUids: IContentGuardItem['tagUids'];
	public readonly imageName?: IContentGuardItem['imageName'];
	public readonly imageUploadFinished?: IContentGuardItem['imageUploadFinished'];
	public readonly prompt?: IContentGuardItem['prompt'];
	public readonly createdAt: IContentGuardItem['createdAt'];
	public readonly updatedAt: IContentGuardItem['updatedAt'];

	constructor(data: IContentGuardItem) {
		fillDataToEntity(this, data);
	}
}
