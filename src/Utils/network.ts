import { networkInterfaces } from 'os';

/**
 * Returns first IPv4 address of the machine.
 * It's useful for local development server.
 */
export function getMachineRemoteAddr(): string {
	const nets = networkInterfaces(),
		machineIps = Object.create(null);
	for (const name of Object.keys(nets)) {
		for (const net of nets[name] ?? []) {
			if (net.family === 'IPv4' && !net.internal) {
				if (!machineIps[name]) {
					machineIps[name] = [];
				}
				machineIps[name].push(net.address);
			}
		}
	}
	const firsInterface = Object.keys(machineIps)[0];
	return machineIps[firsInterface][0];
}
