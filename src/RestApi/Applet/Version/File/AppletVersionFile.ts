import IAppletVersionFile from "./IAppletVersionFile";

export default class AppletVersionFile implements IAppletVersionFile {

	// public readonly [P in keyof IAppletVersionFile]: IAppletVersionFile[P]; // Generalized TS doesn't support
	public readonly content: IAppletVersionFile['content'];
	public readonly name: IAppletVersionFile['name'];
	public readonly path: IAppletVersionFile['path'];
	public readonly type: IAppletVersionFile['type'];

	constructor(data: IAppletVersionFile) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
