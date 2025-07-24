import { fillDataToEntity } from '../../mapper';
import { IPluginVersion } from './IPluginVersion';

export class PluginVersion implements IPluginVersion {
	public readonly pluginUid: IPluginVersion['pluginUid'];
	public readonly version: IPluginVersion['version'];
	public readonly configDefinition?: IPluginVersion['configDefinition'];
	public readonly schema?: IPluginVersion['schema'];
	public readonly jsApiVersion?: IPluginVersion['jsApiVersion'];
	public readonly description?: IPluginVersion['description'];

	constructor(data: IPluginVersion) {
		fillDataToEntity(this, data);
	}
}
