import { now } from '../Utils/time';
import wait from './wait';

const waitUntilTrue = async (predicate: () => Promise<any>, interval: number = 500) => {
	while (true) {
		if (await predicate()) {
			break;
		}

		await wait(interval);
	}
};
export default waitUntilTrue;

export async function waitUntilResolved(waitCallback: () => Promise<void>, timeoutMs: number = 10e3) {
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
