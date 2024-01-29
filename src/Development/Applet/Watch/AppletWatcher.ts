import * as chokidar from 'chokidar';
import * as _ from 'lodash';

/**
 * Represents a watcher for applet files.
 * It can be used to listen to changes in the applet files (onEdit).
 */
export class AppletWatcher {
	constructor(
		private watcher: chokidar.FSWatcher,
		public readonly filePatterns: string[],
		private debounceTimeMs: number,
	) {}

	/**
	 * It emits the path of the file that has changed, added or unlinked/removed.
	 */
	public onEdit(callback: (filePaths: string[]) => void) {
		const notEmittedFilePaths = new Set<string>();

		const clearingCallback = (filePaths: string[]) => {
			notEmittedFilePaths.clear();
			callback(filePaths);
		};
		const debouncedCallback = _.debounce(clearingCallback, this.debounceTimeMs);
		const aggregateingCallback = (filePath: string) => {
			notEmittedFilePaths.add(filePath);
			debouncedCallback([...notEmittedFilePaths]);
		};

		this.watcher.on('change', aggregateingCallback);
		this.watcher.on('add', aggregateingCallback);
		this.watcher.on('unlink', aggregateingCallback);
		return () => {
			this.watcher.removeListener('change', aggregateingCallback);
			this.watcher.removeListener('add', aggregateingCallback);
			this.watcher.removeListener('unlink', aggregateingCallback);
		};
	}

	/**
	 * Close current watcher and remove all listeners.
	 */
	public async close() {
		this.watcher.removeAllListeners();
		await this.watcher.close();
	}
}
