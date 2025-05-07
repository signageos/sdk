import { opts } from '../../helper';
import IAlertRule from '../../../../../src/RestApi/Alerts/Rules/IAlertRule';
import { Api } from '../../../../../src';
import should from 'should';

const api = new Api(opts);

describe('e2e.RestAPI - Alert Rules', () => {
	let createdAlertRule: IAlertRule | undefined;

	before('create new alert rule', async () => {
		createdAlertRule = await api.alert.rules.create({ name: 'Test alert rule' });
		should(createdAlertRule.alertRuleUid.length > 0).be.true();
		should(createdAlertRule.name.length > 0).be.true();
		should(createdAlertRule.companyUid.length > 0).be.true();
	});

	it('should get list of all alert rules', async () => {
		const alertRuleList: IAlertRule[] = await api.alert.rules.list();
		should(Array.isArray(alertRuleList)).true();
		should(alertRuleList.length > 0).true();

		should(alertRuleList[0].alertRuleUid.length > 0).be.true();
		should(alertRuleList[0].name.length > 0).be.true();
		should(alertRuleList[0].companyUid.length > 0).be.true();
		should(alertRuleList[0].createdAt.getTime() > 0).be.true();
	});

	it('should get one alert rule by uid', async () => {
		const oneAlertRule: IAlertRule = await api.alert.rules.get(createdAlertRule!.alertRuleUid);
		should(oneAlertRule.alertRuleUid.length > 0).be.true();
		should(oneAlertRule.name.length > 0).be.true();
		should(oneAlertRule.companyUid.length > 0).be.true();
		should(oneAlertRule.createdAt.getTime() > 0).be.true();
		should(createdAlertRule!.alertRuleUid).be.equal(oneAlertRule.alertRuleUid);
	});

	it('should snooze alert rule', async () => {
		await should(api.alert.rules.pause(createdAlertRule!.alertRuleUid)).be.fulfilled();
	});

	it('should get list of all snoozed alert rules', async () => {
		const archivedRules: IAlertRule[] = await api.alert.rules.list({ paused: true });
		should(Array.isArray(archivedRules)).true();
		should(archivedRules.length > 0).true();
	});

	it('should unsnooze alert rule', async () => {
		await should(api.alert.rules.unpause(createdAlertRule!.alertRuleUid)).be.fulfilled();
	});

	it('should archive alert rule', async () => {
		await should(api.alert.rules.archive(createdAlertRule!.alertRuleUid)).be.fulfilled();
	});

	it('should get list of all archived rules', async () => {
		const archivedRules: IAlertRule[] = await api.alert.rules.list({ archived: true });
		should(Array.isArray(archivedRules)).true();
		should(archivedRules.length > 0).true();
	});
});
