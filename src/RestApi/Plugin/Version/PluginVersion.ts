import { fillDataToEntity } from '../../mapper';
import { IPluginVersion } from './IPluginVersion';

export class PluginVersion implements IPluginVersion {
	public readonly pluginUid: IPluginVersion['pluginUid'];
	public readonly version: IPluginVersion['version'];
	public readonly configDefinition: IPluginVersion['configDefinition'];

	constructor(data: IPluginVersion) {
		fillDataToEntity(this, data);
	}
}
