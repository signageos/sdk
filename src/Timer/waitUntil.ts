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

export async function waitUntilResult<T>(predicate: () => Promise<T>, interval: number = 10e3, timeoutMs: number = 120e3) {
	const startTimestamp = now().valueOf();
	while (true) {
		const currentTimestamp = now().valueOf();
		if (currentTimestamp - startTimestamp > timeoutMs) {
			throw new Error('waitUntilResult function has reached timeout');
		}
		const result = await predicate();
		if (result !== undefined) {
			return result;
		}

		await wait(interval);
	}
}

export async function waitUntilReturnValue<T>(callback: () => Promise<T>, timeoutMs: number = 120e3, interval: number = 10e3) {
	return await waitUntilResult(
		async () => {
			try {
				return await callback();
			} catch {
				return undefined;
			}
		},
		interval,
		timeoutMs,
	);
}
