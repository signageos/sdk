/**
 * Represents a running applet server.
 * It provides methods for stopping the server and cleaning the resources.
 */
export class AppletServer {
	constructor(
		public readonly processUid: string,
		public readonly port: number,
		public readonly publicUrl: string,
		public readonly remoteAddr: string,
		private cleanUpServer: () => Promise<void>,
	) {}

	public async stop() {
		await this.cleanUpServer();
	}
}
