
import RestApi from './RestApi/RestApi';
import waitUntilTrue from './Timer/waitUntil';
const parameters = require('../config/parameters');

const rest = new RestApi({
	url: parameters.apiUrl,
	version: 'v1',
	auth: parameters.auth,
});

export const CURRENT_DEVICE_UID = Symbol('CURRENT_DEVICE_UID');
export const CURRENT_APPLET_UID = Symbol('CURRENT_APPLET_UID');
export const CURRENT_APPLET_VERSION = Symbol('CURRENT_APPLET_VERSION');

export const timing = rest.timing;
export const timingCommand = rest.timingCommand;

export function now() {
	return new Date();
}

export async function waitUntil(waitCallback: () => Promise<void>, timeoutMs: number = 10e3) {
	const startTimestamp = now().valueOf();
	await waitUntilTrue(async () => {
		try {
			await waitCallback();
			return true;
		} catch (error) {
			const currentTimestamp = now().valueOf();
			if (currentTimestamp - startTimestamp > timeoutMs) {
				throw error;
			}
			return false;
		}
	});
}
