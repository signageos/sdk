import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts } from '../helper';
import IEmulator, { IEmulatorCreatable } from '../../../../src/RestApi/Emulator/IEmulator';
import EmulatorManagement from '../../../../src/RestApi/Emulator/EmulatorManagement';
import DeviceManagement from '../../../../src/RestApi/Device/DeviceManagement';

const nockOpts = { ...getNockOpts({}), url: 'https://example.com' };

describe('EmulatorManagement', () => {
	const emulator: IEmulator = {
		uid: 'someIdentityHash',
		duid: 'someDeviceUID',
		name: 'Emulator - USER_1',
		createdAt: new Date('2020-01-11T12:41:52.550Z'),
	};
	const validListResp: IEmulator[] = [emulator];
	const validCreateReq: IEmulatorCreatable = { organizationUid: 'default-org' };
	const validPostRespHeaders: nock.ReplyHeaders = {
		Location: 'https://example.com/v1/device/someIdentityHash',
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/emulator')
		.reply(200, validListResp)
		.get('/v1/emulator?organizationUid=default-org')
		.reply(200, validListResp)
		.post('/v1/emulator')
		.reply(201, 'Created', validPostRespHeaders)
		.get('/v1/device/someIdentityHash')
		.reply(200, { uid: 'someIdentityHash' })
		.delete(/v1\/emulator\/[a-zA-Z0-9]+$/)
		.reply(204, 'Deleted');

	const em = new EmulatorManagement(nockOpts, new DeviceManagement(nockOpts, nockOpts));
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

	it('should get list of emulators of organization', async () => {
		const emulators = await em.list({ organizationUid: 'default-org' });
		should(emulators.length).be.equal(1);
		assertEmulator(emulators[0]);
	});

	it('should create new emulator', async () => {
		const device = await em.create(validCreateReq);
		should(device.uid).be.equal('someIdentityHash');
	});

	it('should delete old emulator', async () => {
		await em.delete(emulator.uid);
		should(true).be.true();
	});
});
