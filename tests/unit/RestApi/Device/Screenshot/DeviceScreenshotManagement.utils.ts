import { random, date, image } from 'faker';

import { IDeviceScreenshot } from '../../../../../src/RestApi/Device/Screenshot/DeviceScreenshot';

export const createScreenshot = (customFields?: Partial<IDeviceScreenshot>) => {
	const screenshot: IDeviceScreenshot = {
		uid: random.uuid(),
		deviceUid: random.uuid(),
		takenAt: date.past(),
		uri: image.imageUrl(),
		...customFields,
	};

	return screenshot;
};
