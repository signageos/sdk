import { random } from 'faker';

import {
	IDevicePeerRecoveryEnabledUpdatable,
	IDevicePeerRecoveryDisabledUpdatable,
} from '../../../../src/RestApi/Device/PeerRecovery/DevicePeerRecovery';
import { DEVICE_1 } from '../Device.fixtures';

export const PEER_RECOVERY_1: IDevicePeerRecoveryEnabledUpdatable = {
	uid: random.uuid(),
	deviceUid: DEVICE_1.uid,
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
	succeededAt: null,
	failedAt: null,
	enabled: true,
	urlLauncherAddress: 'http://localhost:8080',
};
export const PEER_RECOVERY_2: IDevicePeerRecoveryDisabledUpdatable = {
	uid: random.uuid(),
	deviceUid: DEVICE_1.uid,
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
	succeededAt: null,
	failedAt: null,
	enabled: false,
};
