import { log } from '../../../Console/log';
import { getServerMessage, startAppletServer } from './appletServerHelper';

const options = {
	appletUid: process.argv[2],
	appletVersion: process.argv[3],
	port: Number.parseInt(process.argv[4]),
	overridePublicUrl: process.argv[5],
	forwardServerUrl: process.env.SOS_FORWARD_SERVER_URL,
	appletPath: process.env.SOS_APPLET_PATH,
};

if (!options.appletUid || !options.appletVersion || !options.port) {
	throw new Error('Invalid arguments. Usage: node AppletServerProcess.js <appletUid> <appletVersion> <port> [publicUrl]');
}

void startAppletServer(options).then(({ publicUrl, stopServer }) => {
	log('info', getServerMessage(options.appletUid, options.appletVersion, options.port, publicUrl));

	process.send?.({ type: 'ready', publicUrl });

	const stopServerAndExit = async () => {
		await stopServer();
		process.exit(0);
	};

	process.on('SIGINT', stopServerAndExit);
	process.on('SIGTERM', stopServerAndExit);
});
