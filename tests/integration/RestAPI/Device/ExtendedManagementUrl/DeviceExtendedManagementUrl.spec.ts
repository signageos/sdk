import should from 'should';
import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';
import { opts } from '../../helper';

const api = new Api(opts);

describe('Integration.RestAPI.Device.ExtendedManagementUrl', () => {
	let device: IDevice = null!;

	before('create device', async function () {
		device = await api.emulator.create({ organizationUid: opts.organizationUid! });
	});

	after('remove device', async function () {
		await api.emulator.delete(device.uid);
	});

	it('should set and list url', async function () {
		const originalUrl = await api.device.extendedManagementUrl.list(device!.uid);

		should(originalUrl).Array().empty();

		await api.device.extendedManagementUrl.set(device.uid, {
			url: 'https::/example.com',
		});

		const newUrl = await api.device.extendedManagementUrl.list(device!.uid);

		should(newUrl).Array().length(1);
		should(newUrl[0].url).equal('https::/example.com');
	});
});
