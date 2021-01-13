import * as should from 'should';
import * as nock from 'nock';
import { nockOpts } from '../helper';
import IEmulator, { IEmulatorCreatable } from '../../../../src/RestApi/Emulator/IEmulator';
import EmulatorManagement from '../../../../src/RestApi/Emulator/EmulatorManagement';

describe('EmulatorManagement', () => {
	const emulator: IEmulator = {
		uid: 'someIdentityHash',
		duid: 'someDeviceUID',
		name: 'Emulator - USER_1',
		createdAt: new Date('2020-01-11T12:41:52.550Z'),
	};
	const validListResp: IEmulator[] = [emulator];
	const validCreateReq: IEmulatorCreatable = { organizationUid: 'default-org' };

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		},
	).get('/v1/emulator').reply(200, validListResp)
	.post('/v1/emulator').reply(201, 'Created');

	const em = new EmulatorManagement(nockOpts);
	const assertEmulator = (emul: IEmulator) => {
		should(emul.uid).be.equal(emulator.uid);
		should(emul.duid).be.equal(emulator.duid);
		should(emul.name).be.equal(emulator.name);
		should(emul.createdAt).be.deepEqual(emulator.createdAt);
	};

	it('should get list of emulators assigned under the authenticized account', async () => {
		const emulators = await em.list();
		should(emulators.length).be.equal(1);
		assertEmulator(emulators[0]);
	});

	it('should create new emulator', async () => {
		await em.create(validCreateReq);
		should(true).be.true();
	});
});
