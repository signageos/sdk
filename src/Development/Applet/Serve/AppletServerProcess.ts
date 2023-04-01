import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import { log } from '../../../Console/log';
import { getAppletPackageArchivePath, getPackagePublicPath } from '../../runtimeFileSystem';
import { forward } from '@signageos/forward-server-bridge/dist/client';
import { getServerMessage } from './appletServerHelper';

interface IServerOptions {
	appletUid: string;
	appletVersion: string;
	port: number;
	publicUrl?: string;
	forwardServerUrl: string;
}

async function startServer({ appletUid, appletVersion, port, publicUrl: defaultPublicUrl, forwardServerUrl }: IServerOptions) {
	const server = createHttpServer(appletUid, appletVersion);
	const forwarding = await forward({
		localPort: port,
		serverUrl: forwardServerUrl,
	});
	server.listen(port, () => {
		const publicUrl = defaultPublicUrl ?? forwarding.publicUrl;
		log('info', getServerMessage(appletUid, appletVersion, port, publicUrl));
		process.send?.({ type: 'ready', publicUrl });
	});

	const stopServer = async () => {
		const closeHttpPromise = new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
		await Promise.all([closeHttpPromise, forwarding.stop()]);
		process.exit(0);
	};

	process.on('SIGINT', stopServer);
	process.on('SIGTERM', stopServer);
}

function createHttpServer(appletUid: string, appletVersion: string) {
	const packagePublicPath = getPackagePublicPath(appletUid, appletVersion);
	const packageArchivePath = getAppletPackageArchivePath(appletUid, appletVersion);

	const app = express();
	app.use(cors());
	app.use(noCacheMiddleware);
	app.use(packagePublicPath, express.static(packageArchivePath));
	const server = http.createServer(app);

	return server;
}

const noCacheMiddleware = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header('Cache-control', 'no-cache');
	next();
};

if (!process.env.SOS_FORWARD_SERVER_URL) {
	throw new Error('Missing SOS_FORWARD_SERVER_URL environment variable');
}

const options = {
	appletUid: process.argv[2],
	appletVersion: process.argv[3],
	port: parseInt(process.argv[4]),
	publicUrl: process.argv[5],
	forwardServerUrl: process.env.SOS_FORWARD_SERVER_URL,
};

if (!options.appletUid || !options.appletVersion || !options.port) {
	throw new Error('Invalid arguments. Usage: node AppletServerProcess.js <appletUid> <appletVersion> <port> [publicUrl]');
}

startServer(options);
