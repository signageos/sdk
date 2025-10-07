export abstract class BaseError extends Error {
	constructor(
		public readonly reasonMessage: string,
		public readonly recommendations: string[] = [],
	) {
		const message =
			`${reasonMessage}\n` +
			` \nYou can try the following:\n` +
			` ${recommendations.map((recommendation) => `* ${recommendation}`).join('\n')}`;
		super(message);
		Object.setPrototypeOf(this, BaseError.prototype);
	}
}

export class AccountAuthMissingError extends BaseError {
	constructor() {
		super(`Account auth is missing.`, [`Please install cli tool globally using "npm i @signageos/cli -g" and do "sos login" first.`]);
		Object.setPrototypeOf(this, AccountAuthMissingError.prototype);
	}
}

export class DefaultOrganizationMissingError extends BaseError {
	constructor() {
		super(`Default organization is missing.`, [
			`Please install cli tool globally using "npm i @signageos/cli -g" and do "sos organization set-default" first.`,
		]);
		Object.setPrototypeOf(this, AccountAuthMissingError.prototype);
	}
}

export class AppletNotFoundError extends BaseError {
	constructor(public readonly appletName: string) {
		super(`Applet "${appletName}" is not found.`, [
			`Please install cli tool globally using "npm i @signageos/cli -g" and do "sos applet upload" first.`,
		]);
		Object.setPrototypeOf(this, AppletNotFoundError.prototype);
	}
}

export class MultipleAppletFoundError extends BaseError {
	constructor(
		public readonly appletName: string,
		public readonly appletUids: string[],
	) {
		super(`Multiple applets with name "${appletName}" are found: ${appletUids.join(', ')}.`, [
			`Specify the applet uid using environment variable SOS_APPLET_UID.`,
			`Remove all duplicated applets with the same name ${appletName}.`,
		]);
		Object.setPrototypeOf(this, MultipleAppletFoundError.prototype);
	}
}
