import { fillDataToEntity } from "../../../mapper";
import IStorageStatus from "./IStorageStatus";

export default class StorageStatus implements IStorageStatus {

	// public readonly [P in keyof IStorageStatus]: IStorageStatus[P]; // Generalized TS doesn't support
	public readonly internal: IStorageStatus['internal'];
	public readonly removable: IStorageStatus['removable'];
	public readonly updatedAt: IStorageStatus['updatedAt'];

	constructor(data: IStorageStatus) {
		fillDataToEntity(this, data);
	}
}
