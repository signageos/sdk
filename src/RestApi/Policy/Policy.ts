import { fillDataToEntity } from "../mapper";
import IPolicy from './IPolicy';

export default class Policy implements IPolicy {
	public readonly uid: IPolicy['uid'];
	public readonly name: IPolicy['name'];
	public readonly createdAt: IPolicy['createdAt'];
	public readonly items: IPolicy['items'];
	public readonly note: IPolicy['note'];

	constructor(data: IPolicy) {
		fillDataToEntity(this, data);
	}
}
