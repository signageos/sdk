import { fillDataToEntity } from "../../../mapper";
import IAppletVersionFile from "./IAppletVersionFile";

export default class AppletVersionFile implements IAppletVersionFile {

	// public readonly [P in keyof IAppletVersionFile]: IAppletVersionFile[P]; // Generalized TS doesn't support
	public readonly content: IAppletVersionFile['content'];
	public readonly name: IAppletVersionFile['name'];
	public readonly path: IAppletVersionFile['path'];
	public readonly type: IAppletVersionFile['type'];
	public readonly hash: IAppletVersionFile['hash'];
	public readonly size: IAppletVersionFile['size'];

	constructor(data: IAppletVersionFile) {
		fillDataToEntity(this, data);
	}
}
