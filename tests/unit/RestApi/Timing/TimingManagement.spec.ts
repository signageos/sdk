import nock from 'nock';
import should from 'should';
import ITiming, { ITimingUpdatable } from '../../../../src/RestApi/Timing/ITiming';
import TimingManagement from '../../../../src/RestApi/Timing/TimingManagement';
import { ApiVersions } from '../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../src/RestApi/resources';
import { getNockOpts, nockAuthHeader1 } from '../helper';

const nockOpts = getNockOpts({});
const timingManagement = new TimingManagement(nockOpts);

describe('Unit.RestApi.Timing.TimingManagement', () => {
	const validGetResp: ITiming = {
		uid: '832862e2817fec6aba6e0f4e5838ca8e9b69',
		appletUid: '109ade2170b42c0a078a8ff44555fabb996c45ab80f9f26a85',
		deviceUid: '4165eaaacb9ada8a426869f6cb4577f37b0436f056dd8cfc6bcee',
		createdAt: new Date('2023-03-30T14:43:17.486Z'),
		updatedAt: new Date('2023-03-30T14:43:17.486Z'),
		startsAt: new Date('2023-03-30T12:43:00.000Z'),
		endsAt: new Date('2023-03-30T12:43:00.000Z'),
		configuration: {
			identification: '75a3a61201',
		},
		appletVersion: '1.0.0',
		finishEvent: {
			type: 'DURATION',
			data: null,
		},
		position: 1,
	};

	const validGetListResp: ITiming[] = [validGetResp];

	const validSetReq: ITimingUpdatable = {
		appletVersion: '1.0.0',
		startsAt: new Date('2023-03-31T12:00:00'),
		endsAt: new Date('2023-04-01T00:00:00'),
		configuration: {},
		position: 1,
		finishEvent: { type: 'DURATION', data: null },
	};

	it('should get list of timings', async () => {
		nock(nockOpts.url, nockAuthHeader1).get(`/${ApiVersions.V1}/${Resources.Timing}`).reply(200, validGetListResp);

		const list = await timingManagement.getList();

		should(list).be.lengthOf(1);
		should(list[0]).be.containDeep(validGetResp);
	});

	it('should get one timing', async () => {
		nock(nockOpts.url, nockAuthHeader1).get(`/${ApiVersions.V1}/${Resources.Timing}/${validGetResp.uid}`).reply(200, validGetResp);

		const timing = await timingManagement.get(validGetResp.uid);
		should(timing).be.containDeep(validGetResp);
	});

	it('should create timing', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.post(`/${ApiVersions.V1}/${Resources.Timing}`)
			.reply(200, { message: 'OK' })
			.get(`/${ApiVersions.V1}/${Resources.Timing}?deviceUid=${validGetResp.deviceUid}`)
			.reply(200, validGetListResp);

		await should(timingManagement.create(validGetResp)).be.fulfilled();
	});

	it('should update timing', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.put(`/${ApiVersions.V1}/${Resources.Timing}/${validGetResp.uid}`, JSON.stringify(validSetReq))
			.reply(200, { message: 'OK' })
			.get(`/${ApiVersions.V1}/${Resources.Timing}/${validGetResp.uid}`)
			.reply(200, validSetReq);

		await should(timingManagement.update(validGetResp.uid, validSetReq)).be.fulfilled();
	});

	it('should delete timing', async () => {
		nock(nockOpts.url, nockAuthHeader1).delete(`/${ApiVersions.V1}/${Resources.Timing}/${validGetResp.uid}`).reply(200, { message: 'OK' });

		await should(timingManagement.delete(validGetResp.uid)).be.fulfilled();
	});
});
