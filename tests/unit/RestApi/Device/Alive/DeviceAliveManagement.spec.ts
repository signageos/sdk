import * as nock from 'nock';
import * as should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import DeviceAliveManagement from '../../../../../src/RestApi/Device/Alive/DeviceAliveManagement';
import { nockOpts1, nockAuthHeader1 } from '../../helper';
import { DEVICE_ALIVE_1, DEVICE_ALIVE_2 } from './DeviceAliveManagement.utils';

const deviceAliveManagement = new DeviceAliveManagement(nockOpts1);

describe('Unit.RestApi.Device.Alive', () => {
	it('should get many', async () => {
		nock(nockOpts1.url, nockAuthHeader1).get(`/${ApiVersions.V1}/${Resources.Device}/alive`).reply(200, [DEVICE_ALIVE_1, DEVICE_ALIVE_2]);

		const devicesAlive = await deviceAliveManagement.list({});

		should(devicesAlive.length).be.eql(2);
	});

	it('should get one location', async () => {
		nock(nockOpts1.url, nockAuthHeader1)
			.get(`/${ApiVersions.V1}/${Resources.Device}/${DEVICE_ALIVE_1.uid}/alive`)
			.reply(200, DEVICE_ALIVE_1);

		const deviceAlive = await deviceAliveManagement.get({ uid: DEVICE_ALIVE_1.uid });

		should(deviceAlive.uid).be.eql(DEVICE_ALIVE_1.uid);
	});
});
