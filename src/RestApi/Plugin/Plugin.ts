import { fillDataToEntity } from '../mapper';
import { IPlugin } from './IPlugin';

export class Plugin implements IPlugin {
	public readonly uid: IPlugin['uid'];
	public readonly name: IPlugin['name'];
	public readonly title: IPlugin['title'];
	public readonly description?: IPlugin['description'];

	constructor(data: IPlugin) {
		fillDataToEntity(this, data);
	}
}
