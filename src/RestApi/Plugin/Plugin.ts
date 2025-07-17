import { fillDataToEntity } from '../mapper';
import { IPlugin } from './IPlugin';

export class Plugin implements IPlugin {
	public readonly uid: IPlugin['uid'];
	public readonly name: IPlugin['name'];
	public readonly title: IPlugin['title'];
	public readonly organizationUid: IPlugin['organizationUid'];
	public readonly description?: IPlugin['description'];
	public readonly tagUids?: IPlugin['tagUids'];
	public readonly supportedPlatforms?: IPlugin['supportedPlatforms'];
	public readonly latestVersion?: IPlugin['latestVersion'];
	public readonly createdAt?: IPlugin['createdAt'];
	public readonly updatedAt?: IPlugin['updatedAt'];
	public readonly createdBy?: IPlugin['createdBy'];
	public readonly updatedBy?: IPlugin['updatedBy'];

	constructor(data: IPlugin) {
		fillDataToEntity(this, data);
	}
}
