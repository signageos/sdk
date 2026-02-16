import * as chokidar from 'chokidar';
import { log } from '../../../Console/log';
import { SOS_CONFIG_LOCAL_FILENAME } from '../../runtimeFileSystem';
import { AppletFilesManagement } from '../Files/AppletFilesManagement';
import { AppletWatcher } from './AppletWatcher';

const DEFAULT_DEBOUNCE_TIME_MS = 1e3;

export interface IWatchOptions {
	/** Applet root path where the package.json is located */
	appletPath: string;
	/** If not provided, the default is appletPath */
	ignoreBasePath?: string;
	/** The underlying chokidar options directly passed to the watcher. The CWD is always rewritten with appletPath. */
	chokidarOptions?: chokidar.WatchOptions;
	/** The changes are batched by debounce time in ms to prevent multiple builds. By default it has 1000ms */
	debounceTimeMs?: number;
}

/**
 * Watches applet files and notifies about changes.
 * It uses the chokidar library under the hood. It can be configured with the chokidarOptions parameter.
 */
export class AppletWatchManagement {
	constructor(private appletFilesManagement: AppletFilesManagement) {}

	/**
	 * Watches applet files and notifies about changes.
	 */
	public async watch(options: IWatchOptions) {
		const filePatterns = await this.appletFilesManagement.getAppletFilePatterns(options);
		// Also watch sos.config.local.json so config changes trigger a reload on connected devices
		const allPatterns = [...filePatterns, SOS_CONFIG_LOCAL_FILENAME];
		const watcher = chokidar.watch(allPatterns, {
			ignoreInitial: true,
			...options.chokidarOptions,
			cwd: options.appletPath,
		});
		log('info', `Watching applet files in ${options.appletPath}: ${allPatterns.join(', ')}`);

		await waitInitialScanReady(watcher);

		return new AppletWatcher(watcher, allPatterns, options.debounceTimeMs ?? DEFAULT_DEBOUNCE_TIME_MS);
	}
}

function waitInitialScanReady(watcher: chokidar.FSWatcher) {
	return new Promise<void>((resolve, reject) => {
		watcher.on('error', (error) => {
			reject(error);
		});
		watcher.on('ready', () => {
			resolve();
		});
	});
}
