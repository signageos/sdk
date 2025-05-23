import should from 'should';

import { Api } from '../../../../src';
import Emulator from '../../../../src/RestApi/Emulator/Emulator';
import { opts } from '../helper';

const api = new Api(opts);

describe('e2e.RestAPI - Emulator', () => {
	let emulatorUid: string;

	it('should create new emulator', async () => {
		await api.emulator.create({ organizationUid: opts.organizationUid! });
		should(true).be.true();
	});

	it('should get list of emulators', async () => {
		const [emulator] = await api.emulator.list();
		should(emulator instanceof Emulator).be.true();
		should(emulator.uid).be.not.empty();
		emulatorUid = emulator.uid;
		should(emulator.duid).be.not.empty();
		should(emulator.name).be.not.empty();
		should(emulator.createdAt instanceof Date).be.true();
	});

	it('should get list of emulators of organization', async () => {
		const [emulator] = await api.emulator.list({ organizationUid: opts.organizationUid! });
		should(emulator instanceof Emulator).be.true();
		should(emulator.uid).be.not.empty();
		emulatorUid = emulator.uid;
		should(emulator.duid).be.not.empty();
		should(emulator.name).be.not.empty();
		should(emulator.createdAt instanceof Date).be.true();
	});

	it('should delete old emulator', async () => {
		await api.emulator.delete(emulatorUid);
		should(true).be.true();
	});
});
