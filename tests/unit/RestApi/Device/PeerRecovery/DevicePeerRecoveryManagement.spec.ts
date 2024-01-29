import * as nock from 'nock';
import * as should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import { IDevicePeerRecoveryEnabled } from '../../../../../src/RestApi/Device/PeerRecovery/DevicePeerRecovery';
import DevicePeerRecoveryManagement from '../../../../../src/RestApi/Device/PeerRecovery/DevicePeerRecoveryManagement';
import { DEVICE_1 } from '../../../../fixtures/Device/Device.fixtures';
import { PEER_RECOVERY_1, PEER_RECOVERY_2 } from '../../../../fixtures/Device/PeerRecovery/DevicePeerRecovery.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';

const nockOpts = getNockOpts({});
const devicePeerRecoveryManagement = new DevicePeerRecoveryManagement(nockOpts);

describe('Unit.RestApi.Device.PeerRecovery.DevicePeerRecoveryManagement', () => {
	it('should get peer recovery list', async () => {
		const expectedPeerRecoveries = [PEER_RECOVERY_1, PEER_RECOVERY_2];

		nock(nockOpts.url, nockAuthHeader1)
			.get(`/${ApiVersions.V1}/${Resources.Device}/${DEVICE_1.uid}/peer-recovery`)
			.reply(200, expectedPeerRecoveries);

		const peerRecoveries = await devicePeerRecoveryManagement.list(DEVICE_1.uid);

		should(peerRecoveries.length).be.eql(2);
	});

	it('should set peer recovery', async () => {
		const peerRecoveryPayload: {
			enabled: IDevicePeerRecoveryEnabled['enabled'];
			urlLauncherAddress: IDevicePeerRecoveryEnabled['urlLauncherAddress'];
		} = { enabled: true, urlLauncherAddress: 'https://www.t.signageos.io' };

		nock(nockOpts.url, nockAuthHeader1)
			.put(`/${ApiVersions.V1}/${Resources.Device}/${DEVICE_1.uid}/peer-recovery`, JSON.stringify(peerRecoveryPayload))
			.reply(200);

		await should(devicePeerRecoveryManagement.set(DEVICE_1.uid, peerRecoveryPayload)).be.fulfilled();
	});
});
