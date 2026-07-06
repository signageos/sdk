import { loadPackage } from '../../../FileSystem/packageConfig';
import { parameters } from '../../../parameters';
import RestApi from '../../../RestApi/RestApi';
import { AppletNotFoundError, MultipleAppletFoundError } from '../../../SosHelper/errors';

export interface IAppletIdentificationOverride {
	/** Explicit applet UID. When provided, the lookup by package.json name is skipped. */
	appletUid?: string;
	/** Explicit applet version. When provided, the version from package.json is not used. */
	appletVersion?: string;
}

/**
 * Manages applet identification by appletPath, package.json and other sources.
 */
export class AppletIdentificationManagement {
	constructor(private restApiV1: RestApi) {}

	/**
	 * It resolves the appletUid and appletVersion based on the appletPath.
	 * The applet has to be uploaded to signageOS before. Otherwise, it will throw an error.
	 * The appletUid and appletVersion can be overridden explicitly (or via SOS_APPLET_UID env var)
	 * to skip the ambiguous lookup by applet name.
	 */
	public async getAppletUidAndVersion(appletPath: string, override: IAppletIdentificationOverride = {}) {
		const packageConfig = await loadPackage(appletPath);
		if (!packageConfig) {
			throw new Error(`Applet package.json not found in "${appletPath}".`);
		}
		const { name: appletName, version: packageVersion } = packageConfig;
		const appletVersion = override.appletVersion ?? packageVersion;
		if (!appletVersion) {
			throw new Error(`Applet version not found in package.json.`);
		}
		const appletUid = override.appletUid ?? parameters.appletUid;
		if (appletUid) {
			return { appletUid, appletVersion };
		}
		if (!appletName) {
			throw new Error(`Applet name not found in package.json.`);
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
			throw new MultipleAppletFoundError(
				appletName,
				relevantApplets.map((applet) => applet.uid),
			);
		}
		if (relevantApplets.length === 0) {
			throw new AppletNotFoundError(appletName);
		}

		return relevantApplets[0];
	}
}
