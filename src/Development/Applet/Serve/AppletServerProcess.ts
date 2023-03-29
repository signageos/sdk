import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import chalk from "chalk";
import { getAppletPackageArchivePath, getPackagePublicPath } from "../../runtimeFileSystem";
import { log } from '../../../Console/log';

interface IServerOptions {
	appletUid: string;
	appletVersion: string;
	port: number;
	publicUrl?: string;
}

function startServer({ appletUid, appletVersion, port, publicUrl }: IServerOptions) {
	const server = createHttpServer(appletUid, appletVersion);
	server.listen(port, () => {
		log('info', getServerMessage(appletUid, appletVersion, port, publicUrl));
		process.send?.('ready');
	});
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

function getServerMessage(
	appletUid: string,
	appletVersion: string,
	port: number,
	publicUrl: string | undefined = `http://localhost:${port}`,
) {
	return `Serving applet on ${chalk.blue(chalk.bold(publicUrl))} (${chalk.green(appletUid)}@${chalk.green(appletVersion)})`;
}

const options = {
	appletUid: process.argv[2],
	appletVersion: process.argv[3],
	port: parseInt(process.argv[4]),
	publicUrl: process.argv[5],
};

if (!options.appletUid || !options.appletVersion || !options.port) {
	throw new Error('Invalid arguments. Usage: node AppletServerProcess.js <appletUid> <appletVersion> <port> [publicUrl]');
}

startServer(options);
