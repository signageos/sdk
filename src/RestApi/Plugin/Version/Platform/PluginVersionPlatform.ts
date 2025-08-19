import { fillDataToEntity } from '../../../mapper';
import { IPluginVersionPlatform } from './IPluginVersionPlatform';

export class PluginVersionPlatform implements IPluginVersionPlatform {
	public readonly pluginUid: IPluginVersionPlatform['pluginUid'];
	public readonly version: IPluginVersionPlatform['version'];
	public readonly platform: IPluginVersionPlatform['platform'];
	public readonly mainFile: IPluginVersionPlatform['mainFile'];
	public readonly runtime: IPluginVersionPlatform['runtime'];
	public readonly md5Checksum: IPluginVersionPlatform['md5Checksum'];
	public readonly archiveUri: IPluginVersionPlatform['archiveUri'];

	constructor(data: IPluginVersionPlatform) {
		fillDataToEntity(this, data);
	}
}
