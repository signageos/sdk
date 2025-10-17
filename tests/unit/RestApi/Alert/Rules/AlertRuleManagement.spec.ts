import nock from 'nock';
import should from 'should';

import IAlertRule, { IAlertRuleCreatable, IAlertRuleUpdateable } from '../../../../../src/RestApi/Alerts/Rules/IAlertRule';
import AlertRulesManagement from '../../../../../src/RestApi/Alerts/Rules/AlertRulesManagement';
import { createDependencies } from '../../../../../src/RestApi/Dependencies';
import { getNockOpts, successRes } from '../../helper';

const nockOpts = getNockOpts({});

describe('AlertRuleManagement', () => {
	const getLocationHeader = (alertRuleUid: string): nock.ReplyHeaders => ({
		Location: `${nockOpts.url}/${nockOpts.version}/alert-rule/${alertRuleUid}`,
	});

	const validAlertRuleObject: IAlertRule = {
		alertRuleUid: 'someAlertRuleUid',
		name: 'someAlertName',
		description: 'someDescription',
		alertType: 'DEVICE',
		companyUid: 'someCompanyUid',
		createdAt: new Date('2022-02-28T08:56:52.550Z'),
		archivedAt: new Date('2022-02-28T08:56:52.550Z'),
		pausedAt: new Date('2022-02-28T08:56:52.550Z'),
		filter: null,
		conditions: null,
		organizationUids: ['someOrganizationUid', 'someOrganizationUid2'],
		threshold: null,
		periodicity: null,
		action: null,
	};

	const createAlertRuleObject: IAlertRuleCreatable = {
		name: 'someAlertRuleName',
	};

	const updateAlertRuleObject: IAlertRuleUpdateable = {
		name: 'someAlertRuleName',
		description: 'someAlertRuleDescription',
		alertType: 'DEVICE',
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/alert-rule')
		.reply(200, [validAlertRuleObject])
		.get('/v1/alert-rule?archived=true')
		.reply(200, [validAlertRuleObject])
		.get('/v1/alert-rule/someAlertRuleUid')
		.reply(200, validAlertRuleObject)
		.post('/v1/alert-rule', createAlertRuleObject as {})
		.reply(201, successRes, getLocationHeader('someAlertRuleUid'))
		.get('/v1/alert-rule/someAlertRuleUid')
		.reply(200, validAlertRuleObject)
		.put('/v1/alert-rule/someAlertRuleUid', updateAlertRuleObject as {})
		.reply(200, successRes)
		.put('/v1/alert-rule/someAlertRuleUid/archive')
		.reply(200, successRes)
		.put('/v1/alert-rule/someAlertRuleUid/pause')
		.reply(200, successRes)
		.put('/v1/alert-rule/someAlertRuleUid/unpause')
		.reply(200, successRes);

	const alertRuleManagement = new AlertRulesManagement(createDependencies(nockOpts));

	const assertAlertRule = (verifiedAlertRule: IAlertRule, originalAlertRule: IAlertRule) => {
		should(verifiedAlertRule.alertRuleUid).be.equal(originalAlertRule.alertRuleUid);
		should(verifiedAlertRule.name).be.equal(originalAlertRule.name);
		should(verifiedAlertRule.description).be.equal(originalAlertRule.description);
		should(verifiedAlertRule.alertType).be.equal(originalAlertRule.alertType);
	};

	it('should get list of all alert rules', async () => {
		const alertList = await alertRuleManagement.list();
		assertAlertRule(alertList[0], validAlertRuleObject);
	});

	it('should get list only archived alert rules', async () => {
		const alertList = await alertRuleManagement.list({ archived: true });
		assertAlertRule(alertList[0], validAlertRuleObject);
	});

	it('should get specific alert rule by uid', async () => {
		const alertRule = await alertRuleManagement.get('someAlertRuleUid');
		assertAlertRule(alertRule, validAlertRuleObject);
	});

	it('should create alert rule', async () => {
		const alertRuleObject = await alertRuleManagement.create(createAlertRuleObject);
		assertAlertRule(alertRuleObject, validAlertRuleObject);
	});

	it('should update alert rule', async () => {
		await should(alertRuleManagement.update('someAlertRuleUid', updateAlertRuleObject)).be.fulfilled();
	});

	it('should archive alert rule', async () => {
		await should(alertRuleManagement.archive('someAlertRuleUid')).be.fulfilled();
	});

	it('should pause alert rule', async () => {
		await should(alertRuleManagement.pause('someAlertRuleUid')).be.fulfilled();
	});

	it('should unpause alert rule', async () => {
		await should(alertRuleManagement.unpause('someAlertRuleUid')).be.fulfilled();
	});
});
