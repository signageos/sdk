import chalk from 'chalk';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import { log } from '../../../Console/log';
import { getAppletPackageArchivePath, getPackagePublicPath } from '../../runtimeFileSystem';
import { forward } from '@signageos/forward-server-bridge/dist/client';

export function getServerMessage(
	appletUid: string,
	appletVersion: string,
	port: number,
	publicUrl: string | undefined = `http://localhost:${port}`,
) {
	return `Serving applet on ${chalk.blue(chalk.bold(publicUrl))} (${chalk.green(appletUid)}@${chalk.green(appletVersion)})`;
}

export interface IServerOptions {
	appletUid: string;
	appletVersion: string;
	port: number;
	overridePublicUrl?: string;
	forwardServerUrl?: string;
}

export async function startAppletServer({ appletUid, appletVersion, port, overridePublicUrl, forwardServerUrl }: IServerOptions) {
	const server = createHttpServer(appletUid, appletVersion);
	const forwarding = forwardServerUrl
		? await forward({
				localPort: port,
				serverUrl: forwardServerUrl,
			})
		: undefined;
	const publicUrl = overridePublicUrl ?? forwarding?.publicUrl;

	await new Promise<void>((resolve) => server.listen(port, resolve));

	const stopServer = async () => {
		if (!server.listening) {
			return;
		}
		const closeHttpPromise = new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
		await Promise.all([closeHttpPromise, forwarding?.stop()]);
	};
	return { stopServer, publicUrl };
}

function createHttpServer(appletUid: string, appletVersion: string) {
	const packagePublicPath = getPackagePublicPath(appletUid, appletVersion);
	const packageArchivePath = getAppletPackageArchivePath(appletUid, appletVersion);

	const app = express();
	app.use(cors());
	app.use(noCacheMiddleware);
	app.use(packagePublicPath, logMiddleware, express.static(packageArchivePath));
	const server = http.createServer(app);

	return server;
}

const logMiddleware = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
	const reqPath = req.originalUrl;
	log('info', `Serving applet file: ${reqPath}`);
	next();
};

const noCacheMiddleware = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header('Cache-control', 'no-cache');
	next();
};
