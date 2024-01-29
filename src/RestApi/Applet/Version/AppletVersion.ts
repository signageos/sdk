import { fillDataToEntity } from '../../mapper';
import IAppletVersion from './IAppletVersion';

export default class AppletVersion implements IAppletVersion {
	// public readonly [P in keyof IAppletVersion]: IAppletVersion[P]; // Generalized TS doesn't support
	public readonly appletUid: IAppletVersion['appletUid'];
	public readonly version: IAppletVersion['version'];
	public readonly binary: IAppletVersion['binary'];
	public readonly frontAppletVersion: IAppletVersion['frontAppletVersion'];
	public readonly createdAt: IAppletVersion['createdAt'];
	public readonly updatedAt: IAppletVersion['updatedAt'];
	public readonly publishedSince: IAppletVersion['publishedSince'];
	public readonly deprecatedSince: IAppletVersion['deprecatedSince'];
	public readonly builtSince: IAppletVersion['builtSince'];
	public readonly entryFile: IAppletVersion['entryFile'];

	constructor(data: IAppletVersion) {
		fillDataToEntity(this, data);
	}
}
