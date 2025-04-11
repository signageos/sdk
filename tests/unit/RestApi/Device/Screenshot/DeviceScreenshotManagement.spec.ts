import should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import DeviceScreenshotManagement from '../../../../../src/RestApi/Device/Screenshot/DeviceScreenshotManagement';
import { nockOpts1, createNock } from '../../helper';
import { createScreenshot } from './DeviceScreenshotManagement.utils';

const fakeList = [createScreenshot(), createScreenshot(), createScreenshot(), createScreenshot()];

const URL = `/${ApiVersions.V1}/${Resources.Device}/someDeviceUid/screenshot`;

const extractProps = (instances: any[]) => {
	return instances.map((_this: any) =>
		Object.getOwnPropertyNames(_this).reduce((result: object, prop: string) => ({ ...result, [prop]: _this[prop] }), {}),
	);
};

createNock().get(URL).reply(200, fakeList).get(`${URL}?descending=true`).reply(200, fakeList.slice().reverse()).post(URL).reply(200);

const dsm = new DeviceScreenshotManagement(nockOpts1);

describe('Unit.RestApi.Device.Screenshot', () => {
	it('should get last screenshots by devices', async () => {
		createNock().get(`/${ApiVersions.V1}/${Resources.Device}/screenshot`).reply(200, [createScreenshot(), createScreenshot()]);

		const screenshots = await dsm.listLastScreenshotsByDevices({});

		should(screenshots.length).be.eql(2);
	});

	it('should get list of screenshots', async () => {
		const ascendingScreenshots = await dsm.getList('someDeviceUid');
		extractProps(ascendingScreenshots).should.be.deepEqual(fakeList);
		const descendingScreenshots = await dsm.getList('someDeviceUid', { descending: true });
		extractProps(descendingScreenshots).should.be.deepEqual(fakeList.slice().reverse());
	});

	it('should request instant screenshot', async () => {
		await dsm.take('someDeviceUid');
		should(true).be.true();
	});
});
