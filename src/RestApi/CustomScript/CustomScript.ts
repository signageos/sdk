import { fillDataToEntity } from '../mapper';
import { ICustomScript } from './ICustomScript';

export class CustomScript implements ICustomScript {
	public readonly uid: ICustomScript['uid'];
	public readonly name: ICustomScript['name'];
	public readonly title: ICustomScript['title'];
	public readonly description?: ICustomScript['description'];
	public readonly dangerLevel: ICustomScript['dangerLevel'];

	constructor(data: ICustomScript) {
		fillDataToEntity(this, data);
	}
}
