
import wait from './wait';

export default async (predicate: () => Promise<any>, interval: number = 500) => {
	while (true) {
		if (await predicate()) {
			break;
		}

		await wait(interval);
	}
};
