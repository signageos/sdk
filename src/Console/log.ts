import chalk from "chalk";

export type Level = 'info' | 'warning' | 'error';

export function log(level: Level, ...args: string[]) {
	const chalkColor = getChalkColor(level);
	for (const arg of args) {
		process.stderr.write(chalkColor(arg) + '\n');
	}
}

function getChalkColor(level: Level) {
	switch (level) {
		case 'info': return chalk.blue;
		case 'warning': return chalk.yellow;
		case 'error': return chalk.red;
		default: return chalk.white;
	}
}
