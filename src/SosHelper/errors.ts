
export class AccountAuthMissingError extends Error {
	constructor() {
		super(`Please install cli tool globally using "npm i @signageos/cli -g" and do "sos login" first.`);
		Object.setPrototypeOf(this, AccountAuthMissingError.prototype);
	}
}

export class DefaultOrganizationMissingError extends Error {
	constructor() {
		super(`Please install cli tool globally using "npm i @signageos/cli -g" and do "sos organization set-default" first.`);
		Object.setPrototypeOf(this, AccountAuthMissingError.prototype);
	}
}
