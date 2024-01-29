import * as fs from 'fs-extra';

/**
 * Represents a single build of an applet.
 * It contains information abount the built applet
 * and provides methods for cleaning the build when is not more needed.
 */
export class AppletBuild {
	constructor(
		public readonly appletUid: string,
		public readonly appletVersion: string,
		public readonly filePaths: string[],
		public readonly packageArchivePath: string,
		private getAppletRuntimeDir: () => string,
	) {}

	public async clean() {
		await fs.remove(this.getAppletRuntimeDir());
	}
}
