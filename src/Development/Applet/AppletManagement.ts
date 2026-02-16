import { log } from '../../Console/log';
import RestApi from '../../RestApi/RestApi';
import { DeviceConnectManagement } from '../Device/DeviceConnectManagement';
import { AppletHotReload } from './AppletHotReload';
import { AppletBuildManagement } from './Build/AppletBuildManagement';
import { AppletFilesManagement } from './Files/AppletFilesManagement';
import { AppletIdentificationManagement } from './Identification/AppletIdentificationManagement';
import { AppletServeManagement, IServeOptions } from './Serve/AppletServeManagement';
import { AppletWatchManagement, IWatchOptions } from './Watch/AppletWatchManagement';

export interface IHotReloadOptions extends Omit<IServeOptions, 'appletUid' | 'appletVersion' | 'appletPath'>, IWatchOptions {}

/**
 * Applet management contains all applet related functionality for development.
 */
export class AppletManagement {
	public readonly identification: AppletIdentificationManagement;
	public readonly files: AppletFilesManagement;
	public readonly watch: AppletWatchManagement;
	public readonly build: AppletBuildManagement;
	public readonly serve: AppletServeManagement;

	constructor(
		private restApiV1: RestApi,
		private deviceConnectManagement: DeviceConnectManagement,
	) {
		this.identification = new AppletIdentificationManagement(this.restApiV1);
		this.files = new AppletFilesManagement();
		this.watch = new AppletWatchManagement(this.files);
		this.build = new AppletBuildManagement(this.files);
		this.serve = new AppletServeManagement();
	}
	/**
	 * Start applet hot reload independent on building tool (no webpack)
	 * It will watch for changes in applet files based on package.json or ignore files,
	 * serve applet files on local server.
	 * Based on changes in applet, it will build applet
	 * and reload applet on all connected devices
	 */
	public async startHotReload(options: IHotReloadOptions) {
		const { appletUid, appletVersion } = await this.identification.getAppletUidAndVersion(options.appletPath);

		const buildAndReload = async () => {
			const build = await this.build.build({
				...options,
				appletUid,
				appletVersion,
			});
			log('info', `Applet built. Reloading applet on all connected devices...`);
			const { deviceUids } = await this.deviceConnectManagement.reloadConnected();
			log('info', `Applet reloaded on devices: ${deviceUids.join(', ')}`);
			return build;
		};

		log('info', `Initial building of applet...`);
		let appletBuild = await buildAndReload();

		const watcher = await this.watch.watch(options);
		const removeEditListener = watcher.onEdit(async (filePaths) => {
			log('info', `Applet file "${filePaths.join('", "')}" was edited. Rebuilding applet...`);
			appletBuild = await buildAndReload();
		});

		const server = await this.serve.serve({
			...options,
			appletUid,
			appletVersion,
		});

		return new AppletHotReload(watcher, server, async () => {
			removeEditListener();
			await appletBuild.clean();
		});
	}
}
