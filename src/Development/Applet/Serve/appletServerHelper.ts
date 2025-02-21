import chalk from 'chalk';

export function getServerMessage(
	appletUid: string,
	appletVersion: string,
	port: number,
	publicUrl: string | undefined = `http://localhost:${port}`,
) {
	return `Serving applet on ${chalk.blue(chalk.bold(publicUrl))} (${chalk.green(appletUid)}@${chalk.green(appletVersion)})`;
}
