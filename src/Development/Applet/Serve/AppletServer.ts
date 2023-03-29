import * as http from 'http';

/**
 * Represents a running applet server.
 * It provides methods for stopping the server and cleaning the resources.
 */
export class AppletServer {

	constructor(
		private server: http.Server,
		public readonly port: number,
		public readonly publicUrl: string,
		public readonly remoteAddr: string,
		private deletePortFile: () => Promise<void>,
	) {}

	public async stop() {
		await this.deletePortFile();
		return new Promise<void>((resolve) => this.server.close(() => resolve()));
	}
}
