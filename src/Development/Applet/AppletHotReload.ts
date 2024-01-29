import { AppletServer } from './Serve/AppletServer';
import { AppletWatcher } from './Watch/AppletWatcher';

/**
 * Represents a hot reload development instance.
 * After ending the development, it should be stopped.
 */
export class AppletHotReload {
	constructor(
		private watcher: AppletWatcher,
		private server: AppletServer,
		private clean: () => Promise<void>,
	) {}

	/**
	 * Stops and removes all underlying resources.
	 */
	public async stop() {
		await this.server.stop();
		await this.watcher.close();
		await this.clean();
	}
}
