import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, successRes } from '../../helper';
import IReportFile from '../../../../../src/RestApi/Device/Monitoring/ReportFile/IReportFile';
import DeviceMonitoringManagement from '../../../../../src/RestApi/Device/Monitoring/DeviceMonitoringManagement';
import IStorageStatus from '../../../../../src/RestApi/Device/Monitoring/Storage/IStorageStatus';
import ITemperature from '../../../../../src/RestApi/Device/Monitoring/Temperature/ITemperature';
import IHourlyStatus from '../../../../../src/RestApi/Device/Monitoring/HourlyStatus/IHourlyStatus';
import {
	ICreatedDateRangeFilter,
	IDateRangeFilter,
	ITakenDateRangeFilter,
} from '../../../../../src/RestApi/Device/Monitoring/ICreatedDateRangeFilter';
import IScreenshot from '../../../../../src/RestApi/Device/Monitoring/Screenshot/IScreenshot';

const nockOpts = getNockOpts({});

describe('DeviceMonitoringManagement', () => {
	describe('screenshot', () => {
		const scr: IScreenshot = {
			deviceUid: '3ca8a8XXXXbe589b',
			uri: 'https://2.signageos.io/upload/screenshot/75be42f304756aa4e13b3c4d8fd618145c839cacd61ec8ff53',
			takenAt: new Date('2018-06-12T17:49:32.824Z'),
		};
		const scrResp = [scr];
		const filter: ITakenDateRangeFilter = {
			takenSince: new Date('2018-08-16'),
			takenUntil: new Date('2018-08-20'),
		};
		const filterUri = 'takenSince=2018-08-16T00%3A00%3A00.000Z&takenUntil=2018-08-20T00%3A00%3A00.000Z';
		nock(nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
			.get('/v1/device/someUid/screenshot')
			.reply(200, scrResp)
			.get('/v1/device/someUid/screenshot?' + filterUri)
			.reply(200, scrResp)
			.post('/v1/device/someUid/screenshot', {})
			.reply(200, successRes);

		const dmm = new DeviceMonitoringManagement(nockOpts);

		const assertScreenshot = (item: IScreenshot) => {
			should.equal(scr.deviceUid, item.deviceUid);
			should.equal(scr.uri, item.uri);
			should.deepEqual(scr.takenAt, item.takenAt);
		};

		it('get the device screenshots', async () => {
			const items = await dmm.screenshots('someUid');
			should.equal(1, items.length);
			assertScreenshot(items[0]);
		});

		it('get the device screenshots with filters', async () => {
			const items = await dmm.screenshots('someUid', filter);
			should.equal(1, items.length);
			assertScreenshot(items[0]);
		});

		it('take new device screenshot', async () => {
			await dmm.takeScreenshot('someUid');
			should(true).true();
		});
	});

	describe('hourlyStatus', () => {
		const hs: IHourlyStatus = {
			uid: 'aea6XXXX44e7',
			deviceIdentityHash: '3ca8a8XXXXbe589b',
			from: new Date('2018-08-10T11:00:00.000Z'),
			to: new Date('2018-08-10T11:59:59.999Z'),
			time: 0,
			createdAt: new Date('2018-06-12T17:49:32.824Z'),
		};
		const hsResp = [hs];
		const filter: IDateRangeFilter = {
			from: new Date('2018-08-16'),
			to: new Date('2018-08-20'),
		};
		const filterUri = 'from=2018-08-16T00%3A00%3A00.000Z&to=2018-08-20T00%3A00%3A00.000Z';
		nock(nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
			.get('/v1/device/someUid/hourly-connected-status')
			.reply(200, hsResp)
			.get('/v1/device/someUid/hourly-connected-status?' + filterUri)
			.reply(200, hsResp);

		const dmm = new DeviceMonitoringManagement(nockOpts);

		const assertHourlyStatus = (item: IHourlyStatus) => {
			should.equal(hs.uid, item.uid);
			should.equal(hs.deviceIdentityHash, item.deviceIdentityHash);
			should.equal(hs.time, item.time);
			should.deepEqual(hs.from, item.from);
			should.deepEqual(hs.to, item.to);
			should.deepEqual(hs.createdAt, item.createdAt);
		};

		it('get the device hourly status', async () => {
			const items = await dmm.hourlyStatuses('someUid');
			should.equal(1, items.length);
			assertHourlyStatus(items[0]);
		});

		it('get the device hourly status with filters', async () => {
			const items = await dmm.hourlyStatuses('someUid', filter);
			should.equal(1, items.length);
			assertHourlyStatus(items[0]);
		});
	});

	describe('temperature', () => {
		const temperature: ITemperature = {
			uid: 'aea6XXXX44e7',
			deviceUid: '3ca8a8XXXXbe589b',
			temperature: 34,
			createdAt: new Date('2018-06-12T17:49:32.824Z'),
		};
		const tempResp = [temperature];
		const reportFilter: ICreatedDateRangeFilter = {
			createdSince: new Date('2018-08-16'),
			createdUntil: new Date('2018-08-20'),
		};
		const reportFilterUri = 'createdSince=2018-08-16T00%3A00%3A00.000Z&createdUntil=2018-08-20T00%3A00%3A00.000Z';
		nock(nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
			.get('/v1/device/someUid/temperature')
			.reply(200, tempResp)
			.get('/v1/device/someUid/temperature?' + reportFilterUri)
			.reply(200, tempResp);

		const dmm = new DeviceMonitoringManagement(nockOpts);

		const assertTemperature = (t: ITemperature) => {
			should.equal(temperature.uid, t.uid);
			should.equal(temperature.deviceUid, t.deviceUid);
			should.equal(temperature.temperature, t.temperature);
			should.deepEqual(temperature.createdAt, t.createdAt);
		};

		it('get the device temperatures', async () => {
			const t = await dmm.temperatures('someUid');
			should.equal(1, t.length);
			assertTemperature(t[0]);
		});

		it('get the device temperatures with filters', async () => {
			const t = await dmm.temperatures('someUid', reportFilter);
			should.equal(1, t.length);
			assertTemperature(t[0]);
		});
	});

	describe('storage status', () => {
		const storageResp: IStorageStatus = {
			internal: {
				capacity: 4780195840,
				freeSpace: 2758709248,
			},
			removable: {
				capacity: 0,
				freeSpace: 0,
			},
			updatedAt: new Date('2018-09-07T11:41:28.573Z'),
		};

		nock(nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
			.get('/v1/device/someUid/storage')
			.reply(200, storageResp);

		const dmm = new DeviceMonitoringManagement(nockOpts);

		it('get the device storage status', async () => {
			const st = await dmm.storage('someUid');
			should.deepEqual(storageResp.internal, st.internal);
			should.deepEqual(storageResp.removable, st.removable);
			should.deepEqual(storageResp.updatedAt, st.updatedAt);
		});
	});

	describe('reports files', () => {
		const report: IReportFile = {
			deviceUid: '6496XXXcadeb',
			createdAt: new Date('2018-08-16T00:11:44.777Z'),
			urn: '/reports/6496XXXXXacadeb/Applet.ActiveAppletDispatchCommand_Applet.Command/2018-08-16.csv',
			uri: 'https://2.signageos.io/reports/6496XXXXcadeb/Applet.ActiveAppletDispatchCommand_Applet.Command/2018-08-16.csv',
			type: 'Applet.ActiveAppletDispatchCommand_Applet.Command',
		};
		const reportResp = [report];
		const reportFilter: ICreatedDateRangeFilter = {
			createdSince: new Date('2018-08-16'),
			createdUntil: new Date('2018-08-20'),
		};
		const filterUri = 'createdSince=2018-08-16T00%3A00%3A00.000Z&createdUntil=2018-08-20T00%3A00%3A00.000Z';
		nock(nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
			.get('/v1/device/someUid/report')
			.reply(200, reportResp)
			.get('/v1/device/someUid/report?' + filterUri)
			.reply(200, reportResp);

		const dmm = new DeviceMonitoringManagement(nockOpts);

		const assertReport = (rep: IReportFile) => {
			should.equal(report.deviceUid, rep.deviceUid);
			should.equal(report.type, rep.type);
			should.equal(report.uri, rep.uri);
			should.equal(report.urn, rep.urn);
			should.deepEqual(report.createdAt, rep.createdAt);
		};

		it('get the device reports file', async () => {
			const rep = await dmm.reports('someUid');
			should.equal(1, rep.length);
			assertReport(rep[0]);
		});

		it('get the device reports file with filters', async () => {
			const rep = await dmm.reports('someUid', reportFilter);
			should.equal(1, rep.length);
			assertReport(rep[0]);
		});
	});
});
