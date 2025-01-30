import { fillDataToEntity } from '../../../mapper';
import { ICustomScriptVersionPlatform } from './ICustomScriptVersionPlatform';

export class CustomScriptVersionPlatform implements ICustomScriptVersionPlatform {
	public readonly customScriptUid: ICustomScriptVersionPlatform['customScriptUid'];
	public readonly version: ICustomScriptVersionPlatform['version'];
	public readonly platform: ICustomScriptVersionPlatform['platform'];
	public readonly mainFile: ICustomScriptVersionPlatform['mainFile'];
	public readonly runtime: ICustomScriptVersionPlatform['runtime'];
	public readonly md5Checksum: ICustomScriptVersionPlatform['md5Checksum'];
	public readonly archiveUri: ICustomScriptVersionPlatform['archiveUri'];

	constructor(data: ICustomScriptVersionPlatform) {
		fillDataToEntity(this, data);
	}
}
