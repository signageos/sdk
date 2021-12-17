import { fillDataToEntity } from "../../mapper";
import IPowerAction from "./IPowerAction";

export default class PowerAction implements IPowerAction {

	// public readonly [P in keyof IPowerAction]: IPowerAction[P]; // Generalized TS doesn't support
	public readonly uid: IPowerAction['uid'];
	public readonly deviceUid: IPowerAction['deviceUid'];
	public readonly powerType: IPowerAction['powerType'];
	public readonly createdAt: IPowerAction['createdAt'];
	public readonly succeededAt: IPowerAction['succeededAt'];
	public readonly failedAt: IPowerAction['failedAt'];

	constructor(data: IPowerAction) {
		fillDataToEntity(this, data);
	}
}
