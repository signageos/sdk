import * as nock from 'nock';
import * as should from 'should';

import { getNockOpts, successRes } from '../helper';
import IAlert, { AlertSnooze, DeviceAlertSnooze, IAlertCreatable } from '../../../../src/RestApi/Alerts/IAlert';
import AlertManagement from '../../../../src/RestApi/Alerts/AlertManagement';

const nockOpts = getNockOpts({});

describe('AlertManagement', () => {
	const getLocationHeader = (alertUid: string): nock.ReplyHeaders => ({
		Location: `${nockOpts.url}/${nockOpts.version}/alert/${alertUid}`,
	});

	const validAlertObject: IAlert = {
		alertUid: 'someUid',
		organizationUid: 'someOrganizationUid',
		description: 'someDescription',
		alertRuleUid: 'someAlertRuleUid',
		createdAt: new Date('2022-02-28T08:56:52.550Z'),
		archivedAt: new Date('2022-02-28T09:00:00.000Z'),
		deviceUids: ['deviceUid1', 'deviceUid2'],
		latelyChangedAt: new Date('2022-02-28T10:11:30.000Z'),
		snoozeRule: null,
	};

	const validAlertObjectNonArchived: IAlert = {
		alertUid: 'someUid',
		organizationUid: 'someOrganizationUid',
		description: 'someDescription',
		alertRuleUid: 'someAlertRuleUid',
		createdAt: new Date('2022-02-28T08:56:52.550Z'),
		archivedAt: null,
		deviceUids: ['deviceUid1', 'deviceUid2'],
		latelyChangedAt: new Date('2022-02-28T10:11:30.000Z'),
		snoozeRule: null,
	};

	const validAlertCreateObject: IAlertCreatable = {
		name: 'someAlertName',
		organizationUid: 'someOrganizationUid',
		description: 'someDescription',
		alertRuleUid: 'someAlertRuleUid',
	};

	const validSnoozableAlertObject: AlertSnooze = {
		alertUid: 'someAlertUid',
		snoozeRule: {
			type: 'datetime',
			snoozedUntil: '2022-02-28T12:11:30.000Z',
		},
	};

	const validDeviceAlertSnoozeObject: DeviceAlertSnooze = { snoozeRule: { type: 'datetime', snoozedUntil: '2040-02-28T12:11:30.000Z' } };

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/alert')
		.reply(200, [validAlertObject])
		.get('/v1/alert?archived=true')
		.reply(200, [validAlertObjectNonArchived])
		.get('/v1/alert/someAlertUid')
		.reply(200, validAlertObject)
		.post('/v1/alert', validAlertCreateObject as {})
		.reply(201, successRes, getLocationHeader('someAlertUid'))
		.get('/v1/alert/someAlertUid')
		.reply(200, validAlertObject)
		.put('/v1/alert/someAlertUid', { description: 'someNewDescription' })
		.reply(200, successRes)
		.put('/v1/alert/someAlertUid/archive')
		.reply(200, successRes)
		.put('/v1/alert/someAlertUid/unarchive')
		.reply(200, successRes)
		.put('/v1/alert/someAlertUid/snooze', validSnoozableAlertObject as {})
		.reply(200, successRes)
		.put('/v1/alert/someAlertUid/unsnooze')
		.reply(200, successRes)
		.post('/v1/alert/someAlertUid/deviceUid/device-snooze', validDeviceAlertSnoozeObject as {})
		.reply(204)
		.delete('/v1/alert/someAlertUid/deviceUid/device-snooze')
		.reply(204);

	const alertManagement = new AlertManagement(nockOpts);

	const assertAlert = (verifiedAlert: IAlert, originalAlert: IAlert) => {
		should(verifiedAlert.alertUid).be.equal(originalAlert.alertUid);
		should(verifiedAlert.organizationUid).be.equal(originalAlert.organizationUid);
		should(verifiedAlert.description).be.equal(originalAlert.description);
		should(verifiedAlert.alertRuleUid).be.equal(originalAlert.alertRuleUid);
		should(verifiedAlert.snoozeRule).be.equal(originalAlert.snoozeRule);
	};

	it('should get full list of alerts', async () => {
		const alertList = await alertManagement.list();
		assertAlert(alertList[0], validAlertObject);
	});

	it('should only get list of archived alerts', async () => {
		const archivedAlertList = await alertManagement.list({ archived: true });
		assertAlert(archivedAlertList[0], validAlertObjectNonArchived);
	});

	it('should get one specific alert by alertUid', async () => {
		const alertObject = await alertManagement.get('someAlertUid');
		assertAlert(alertObject, validAlertObject);
	});

	it('should create new alert', async () => {
		const alertObject = await alertManagement.create(validAlertCreateObject);
		assertAlert(alertObject, validAlertObject);
	});

	it('should update description of the alert', async () => {
		await should(alertManagement.updateDescription('someAlertUid', 'someNewDescription')).be.fulfilled();
	});

	it('should archive alert', async () => {
		await should(alertManagement.archive('someAlertUid')).be.fulfilled();
	});

	it('should unarchive alert', async () => {
		await should(alertManagement.unarchive('someAlertUid')).be.fulfilled();
	});

	it('should snooze alert until specific date', async () => {
		await should(alertManagement.snooze('someAlertUid', validSnoozableAlertObject)).be.fulfilled();
	});

	it('should unsnooze alert', async () => {
		await should(alertManagement.unsnooze('someAlertUid')).be.fulfilled();
	});

	it('should snooze device alert', async () => {
		await should(alertManagement.snoozeDevice('someAlertUid', 'deviceUid', validDeviceAlertSnoozeObject)).be.fulfilled();
	});

	it('should unsnooze device alert', async () => {
		await should(alertManagement.unsnoozeDevice('someAlertUid', 'deviceUid')).be.fulfilled();
	});
});
