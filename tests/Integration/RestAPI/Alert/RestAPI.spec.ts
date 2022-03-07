import { ALLOWED_TIMEOUT, opts, preRunCheck } from "../helper";
import { Api } from "../../../../src";
import IAlert from "../../../../src/RestApi/Alerts/IAlert";
import * as should from "should";
import IAlertRule from "../../../../src/RestApi/Alerts/Rules/IAlertRule";

const api = new Api(opts);

describe("RestAPI - Alerts", () => {

	before(function () {
		preRunCheck(this.skip.bind(this));
	});

	let createdAlert: IAlert | undefined;

	it('should get list of alerts', async () => {
		const alertList: IAlert[] = await api.alert.list();
		should(Array.isArray(alertList)).true();
		should(alertList.length > 0).true();
		should(alertList[0].alertUid.length > 0).be.true();
		should(alertList[0].organizationUid.length > 0).be.true();
		should(alertList[0].description.length > 0).be.true();
		should(alertList[0].alertRuleUid.length > 0).be.true();
		should(alertList[0].createdAt.getTime() > 0).be.true();
	});

	it('should create new alert', async () => {
		const createdAlertRule: IAlertRule = await api.alert.rules.create({ name: 'Test alert rule' });
		createdAlert = await api.alert.create({
			name: 'Test Alert',
			organizationUid: opts.organizationUid!,
			description: 'Api request created alert.',
			alertRuleUid: createdAlertRule.alertRuleUid,
		});
		should(createdAlert.alertUid.length > 0).be.true();
		should(createdAlert.description!.length > 0).be.true();
		should(createdAlert.alertRuleUid.length > 0).be.true();
	});

	it('should get alert by uid', async () => {
		if (!createdAlert || !createdAlert.alertUid) {
			return;
		}
		const alertObject: IAlert = await api.alert.get(createdAlert.alertUid);
		should(createdAlert.alertUid).equal(alertObject.alertUid);
	});

	it('should archive alert', async () => {
		await should(api.alert.archive(createdAlert!.alertUid)).be.fulfilled();
	});

	it('should get list of archived alerts', async () => {
		const archivedAlerts: IAlert[] = await api.alert.list({ archived: true });
		should(Array.isArray(archivedAlerts)).true();
		should(archivedAlerts.length > 0).true();
	});

	it('should unarchive alert', async () => {
		await should(api.alert.unarchive(createdAlert!.alertUid)).be.fulfilled();
	});

	it('should update description of alert', async () => {
		await should(api.alert.updateDescription(createdAlert!.alertUid, 'Updated description.')).be.fulfilled();
	});

	it('should pause alert', async () => {
		await should(api.alert.snooze(createdAlert!.alertUid, {
			alertUid: createdAlert!.alertUid,
			snoozeRule: {
				type: 'datetime',
				snoozedUntil: new Date(),
			},
		})).be.fulfilled();
	});

	it('should unpause alert', async () => {
		await should(api.alert.unsnooze(createdAlert!.alertUid)).be.fulfilled();
	});
}).timeout(ALLOWED_TIMEOUT);
