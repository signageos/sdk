import { fillDataToEntity } from "../mapper";
import { IPackage } from "./IPackage";

export default class Package {
	public readonly uid: IPackage['uid'];
	public readonly createdAt: IPackage['createdAt'];
	public readonly packageName: IPackage['packageName'];
	public readonly label: IPackage['label'];
	public readonly description: IPackage['description']
	public readonly ownerOrganizationUid: IPackage['ownerOrganizationUid'];
	public readonly createdByAccountId: IPackage['createdByAccountId'];

	constructor(data: IPackage) {
		fillDataToEntity(this, data);
	}
}
