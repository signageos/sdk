import { fillDataToEntity } from '../../mapper';
import { IContentGuardCategory } from './IContentGuardCategory';

export class ContentGuardCategory implements IContentGuardCategory {
	public readonly uid: IContentGuardCategory['uid'];
	public readonly title: IContentGuardCategory['title'];
	public readonly organizationUid: IContentGuardCategory['organizationUid'];
	public readonly valid: IContentGuardCategory['valid'];
	public readonly createdAt: IContentGuardCategory['createdAt'];
	public readonly updatedAt: IContentGuardCategory['updatedAt'];

	constructor(data: IContentGuardCategory) {
		fillDataToEntity(this, data);
	}
}
