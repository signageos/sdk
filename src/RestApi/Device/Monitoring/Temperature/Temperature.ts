import { fillDataToEntity } from '../../../mapper';
import ITemperature from './ITemperature';

export default class Temperature implements ITemperature {
	// public readonly [P in keyof ITemperature]: ITemperature[P]; // Generalized TS doesn't support
	public readonly uid: ITemperature['uid'];
	public readonly deviceUid: ITemperature['deviceUid'];
	public readonly temperature: ITemperature['temperature'];
	public readonly createdAt: ITemperature['createdAt'];

	constructor(data: ITemperature) {
		fillDataToEntity(this, data);
	}
}
