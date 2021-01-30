import IEmulator from './IEmulator';

export default class Emulator implements IEmulator {

	// public readonly [P in keyof IEmulator]: IEmulator[P]; // Generalized TS doesn't support
	public readonly uid: IEmulator['uid'];
	public readonly duid: IEmulator['duid'];
	public readonly name: IEmulator['name'];
	public readonly createdAt: IEmulator['createdAt'];

	constructor(data: IEmulator) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
