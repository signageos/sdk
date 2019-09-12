import IAppletTestSuite from "./IAppletTestSuite";

export default class AppletTestSuite implements IAppletTestSuite {

	// public readonly [P in keyof IAppletTestSuite]: IAppletTestSuite[P]; // Generalized TS doesn't support
	public readonly appletUid: IAppletTestSuite['appletUid'];
	public readonly appletVersion: IAppletTestSuite['appletVersion'];
	public readonly identifier: IAppletTestSuite['identifier'];
	public readonly binary: IAppletTestSuite['binary'];

	constructor(data: IAppletTestSuite) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
