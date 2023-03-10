import RestApi from "../../../RestApi/RestApi";
import { loadPackage } from "../../../FileSystem/packageConfig";
import { AppletNotFoundError, MultipleAppletFoundError } from "../../../SosHelper/errors";

/**
 * Manages applet identification by appletPath, package.json and other sources.
 */
export class AppletIdentificationManagement {

	constructor(
		private restApiV1: RestApi,
	) {}

	/**
	 * It resolves the appletUid and appletVersion based on the appletPath.
	 * The applet has to be uploaded to signageOS before. Otherwise, it will throw an error.
	 */
	public async getAppletUidAndVersion(appletPath: string) {
		const packageConfig = await loadPackage(appletPath);
		if (!packageConfig) {
			throw new Error(`Applet package.json not found in "${appletPath}".`);
		}
		const { name: appletName, version: appletVersion } = packageConfig;
		if (!appletName) {
			throw new Error(`Applet name not found in package.json.`);
		}
		if (!appletVersion) {
			throw new Error(`Applet version not found in package.json.`);
		}
		const applet = await this.getAppletByName(appletName);

		return { appletUid: applet.uid, appletVersion };
	}

	/**
	 * There is preferred way to have only a single applet with a given name.
	 * This method will return the applet with the given name.
	 * However, for historical reasons, there can be multiple applets with the same name.
	 * It case of multiple applets with the same name, this method will throw an error.
	 */
	public async getAppletByName(appletName: string) {
		const applets = await this.restApiV1.applet.list();
		const relevantApplets = applets.filter((applet) => applet.name === appletName);
		if (relevantApplets.length > 1) {
			throw new MultipleAppletFoundError(appletName, relevantApplets.map((applet) => applet.uid));
		}
		if (relevantApplets.length === 0) {
			throw new AppletNotFoundError(appletName);
		}

		return relevantApplets[0];
	}
}
