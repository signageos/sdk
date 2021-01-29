import * as should from 'should';
import * as nock from "nock";
import { nockOpts } from "../../helper";
import DeviceScreenshotManagement from '../../../../../src/RestApi/Device/Screenshot/DeviceScreenshotManagement';
import IDeviceScreenshot from '../../../../../src/RestApi/Device/Screenshot/IDeviceScreenshot';

const extractProps = (instances: any[]) => {
	return instances.map(
		(_this: any) => Object.getOwnPropertyNames(_this).reduce(
			(result: object, prop: string) => ({...result, [prop]: _this[prop] }),
			{},
		),
	);
};

describe('DeviceScreenshotManagement', () => {
	const fakeList: IDeviceScreenshot[] = [
		{ deviceUid: 'someDeviceUid', takenAt: new Date('2020-01-27T12:00:00.000Z'), uri: 'https://signageos.io/someUid1' },
		{ deviceUid: 'someDeviceUid', takenAt: new Date('2020-01-27T12:00:01.000Z'), uri: 'https://signageos.io/someUid2' },
		{ deviceUid: 'someDeviceUid', takenAt: new Date('2020-01-27T12:00:02.000Z'), uri: 'https://signageos.io/someUid3' },
		{ deviceUid: 'someDeviceUid', takenAt: new Date('2020-01-27T12:00:03.000Z'), uri: 'https://signageos.io/someUid4' },
	];

	const URL = '/v1/device/someDeviceUid/screenshot';
	nock(nockOpts.url, {
		reqheaders: {
			"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
	.get(URL).reply(200, fakeList)
	.get(`${URL}?descending=true`).reply(200, fakeList.slice().reverse())
	.post(URL).reply(200);

	const dsm = new DeviceScreenshotManagement(nockOpts);

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
