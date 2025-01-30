import { fillDataToEntity } from '../../mapper';
import { ICustomScriptVersion } from './ICustomScriptVersion';

export class CustomScriptVersion implements ICustomScriptVersion {
	public readonly customScriptUid: ICustomScriptVersion['customScriptUid'];
	public readonly version: ICustomScriptVersion['version'];
	public readonly configDefinition: ICustomScriptVersion['configDefinition'];

	constructor(data: ICustomScriptVersion) {
		fillDataToEntity(this, data);
	}
}
