import IScreenshot from "./IScreenshot";

export default class Screenshot implements IScreenshot {

	// public readonly [P in keyof IScreenshot]: IScreenshot[P]; // Generalized TS doesn't support
	public readonly deviceUid: IScreenshot['deviceUid'];
	public readonly uri: IScreenshot['uri'];
	public readonly takenAt: IScreenshot['takenAt'];

	constructor(data: IScreenshot) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
