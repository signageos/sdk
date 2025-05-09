import Debug from 'debug';
const debug = Debug('@signageos/sdk:Utils:process');

export interface Killable {
	kill(signal: NodeJS.Signals): boolean;
	once(event: 'close', listener: () => void): void;
}

export function killGracefullyWithTimeoutSigKill(killable: Killable, timeoutMs: number): Promise<boolean> {
	return new Promise<boolean>((resolve: (wasClosed: boolean) => void) => {
		debug('Killing process with SIGTERM');
		const termed = killable.kill('SIGTERM');
		debug('Termed', termed);
		if (!termed) {
			resolve(false);
			return;
		}

		const killTimeout = setTimeout(() => {
			debug('Killing process with SIGKILL');
			const killed = killable.kill('SIGKILL');
			debug('Killed', killed);
		}, timeoutMs);
		killable.once('close', () => {
			debug('Process closed');
			clearTimeout(killTimeout);
			resolve(true);
		});
	});
}
