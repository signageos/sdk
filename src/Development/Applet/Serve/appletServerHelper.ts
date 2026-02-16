import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs-extra';
import { log } from '../../../Console/log';
import { getAppletPackageArchivePath, getPackagePublicPath, SOS_CONFIG_LOCAL_FILENAME } from '../../runtimeFileSystem';
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
	/** Path to the applet source directory used for serving sos.config.local.json directly */
	appletPath?: string;
}

export async function startAppletServer({
	appletUid,
	appletVersion,
	port,
	overridePublicUrl,
	forwardServerUrl,
	appletPath,
}: IServerOptions) {
	const server = createHttpServer(appletUid, appletVersion, appletPath);
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
		const promises = [closeHttpPromise];
		if (forwarding) {
			promises.push(forwarding.stop());
		}
		await Promise.all(promises);
	};
	return { stopServer, publicUrl };
}

function createHttpServer(appletUid: string, appletVersion: string, appletPath: string | undefined) {
	const packagePublicPath = getPackagePublicPath(appletUid, appletVersion);
	const packageArchivePath = getAppletPackageArchivePath(appletUid, appletVersion);

	const app = express();
	app.use(cors());
	app.use(noCacheMiddleware);
	app.get('/config', createConfigHandler(appletPath));
	app.post('/log', bodyParser.json(), logHandler);
	app.post('/error', bodyParser.json(), errorHandler);
	app.use(packagePublicPath, logMiddleware, express.static(packageArchivePath));
	const server = http.createServer(app);

	return server;
}

type ConsoleType = 'debug' | 'log' | 'info' | 'warn' | 'error';

type LogData = {
	type: ConsoleType;
	args: string[];
};

type ErrorData = {
	message: string;
	filename: string;
	lineno: number;
	colno: number;
	error: string;
};

const consoleTypeToLogLevel = (consoleType: ConsoleType) => {
	const levelsMap = {
		debug: 'info',
		log: 'info',
		info: 'info',
		warn: 'warning',
		error: 'error',
	} as const;
	return levelsMap[consoleType] ?? 'info';
};

/**
 * Creates a handler that serves the local configuration from `sos.config.local.json`.
 * Reads directly from the applet source directory on every request so that changes
 * are picked up immediately without requiring a rebuild.
 * Returns the config JSON if the file exists and is valid, or an empty object `{}` otherwise.
 * This endpoint is consumed by front-display on connected devices to apply local configuration.
 */
function createConfigHandler(appletPath: string | undefined) {
	return async (_req: express.Request, res: express.Response) => {
		const configPath = path.join(appletPath ?? process.cwd(), SOS_CONFIG_LOCAL_FILENAME);
		try {
			if (await fs.pathExists(configPath)) {
				const content = await fs.readFile(configPath, 'utf8');
				const config = JSON.parse(content);
				log('info', `Serving local config from ${configPath}`);
				res.json(config);
				return;
			}
		} catch (error) {
			log('warning', `Failed to read local config: ${error}`);
		}
		res.json({});
	};
}

const logHandler = (req: express.Request, res: express.Response) => {
	const data: LogData = req.body;
	const logLevel = consoleTypeToLogLevel(data.type);
	log(logLevel, `${new Date().toISOString()}:`, ...data.args);
	res.status(200);
	res.end();
};

const errorHandler = (req: express.Request, res: express.Response) => {
	const data: ErrorData = req.body;
	log('error', `${new Date().toISOString()}:`, data.message, `at ${data.filename}:${data.lineno}:${data.colno}`, data.error);
	res.status(200);
	res.end();
};

export const formatBytes = (bytes: number): string => {
	if (bytes === 0) {
		return '0 B';
	}
	const units = ['B', 'KB', 'MB', 'GB'];
	const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	const value = bytes / Math.pow(1024, exponent);
	return `${value.toFixed(exponent > 0 ? 2 : 0)} ${units[exponent]}`;
};

const logMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const method = req.method.toUpperCase();
	const reqPath = req.originalUrl;
	log('info', `Serving applet file: ${method} ${reqPath}`);

	const originalWrite = res.write.bind(res);
	const originalEnd = res.end.bind(res);
	const originalSetHeader = res.setHeader.bind(res);
	let totalBytes = 0;
	let contentLength: number | undefined;
	let lastProgressUpdate = 0;

	res.setHeader = function (name: string, value: string | number | readonly string[]): express.Response {
		if (name.toLowerCase() === 'content-length') {
			contentLength = typeof value === 'number' ? value : parseInt(String(value), 10);
		}
		return originalSetHeader(name, value);
	};

	const updateProgress = (final: boolean = false) => {
		let progressText: string;
		if (contentLength) {
			const percentage = Math.min(100, (totalBytes / contentLength) * 100).toFixed(1);
			progressText = `  ↳ Downloaded: ${formatBytes(totalBytes)} / ${formatBytes(contentLength)} (${percentage}%)`;
		} else {
			progressText = `  ↳ Downloaded: ${formatBytes(totalBytes)}`;
		}
		if (final) {
			process.stdout.write(`\r${progressText}\n`);
		} else {
			process.stdout.write(`\r${progressText}`);
		}
	};

	res.write = function (chunk: string | Uint8Array, ...args: unknown[]): boolean {
		if (chunk) {
			totalBytes += chunk.length;
			const now = Date.now();
			// Update progress at most every 100ms to avoid excessive console writes
			if (now - lastProgressUpdate > 100) {
				updateProgress();
				lastProgressUpdate = now;
			}
		}
		return (originalWrite as (...a: unknown[]) => boolean)(chunk, ...args);
	} as typeof res.write;

	res.end = function (chunk?: string | Uint8Array, ...args: unknown[]): express.Response {
		if (chunk) {
			totalBytes += chunk.length;
		}
		if (totalBytes > 0) {
			updateProgress(true);
		}
		return (originalEnd as (...a: unknown[]) => express.Response)(chunk, ...args);
	} as typeof res.end;

	next();
};

const noCacheMiddleware = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header('Cache-control', 'no-cache');
	next();
};
