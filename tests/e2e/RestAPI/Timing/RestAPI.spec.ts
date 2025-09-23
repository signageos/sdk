import should from 'should';
import { Api } from '../../../../src';
import IDevice from '../../../../src/RestApi/Device/IDevice';
import { ITimingCreateOnly, ITimingUpdatable } from '../../../../src/RestApi/Timing/ITiming';
import { opts } from '../helper';

const api = new Api(opts);

describe('e2e.RestAPI - Timing', function () {
	let device: IDevice;
	let timingUid: string;
	let timingUidWithoutIdentification: string;
	let timingUidWithFinishedEventString: string;
	let timingUidWithFinishedEventObject: string;

	const identification = 'identification_123456a+';
	const sosAppletUid = '658ec4c07707a906e4e3469c959b86f1564f1035a1b50e2cb8';

	const createProps: ITimingCreateOnly & ITimingUpdatable = {
		appletUid: sosAppletUid,
		// assign later
		deviceUid: '',
		appletVersion: '1.0.0',
		startsAt: new Date('2023-03-31T12:00:00'),
		endsAt: new Date('2023-04-01T00:00:00'),
		configuration: { identification: identification },
		position: 1,
		finishEvent: { type: 'DURATION', data: null },
	};

	before('create device', async function () {
		device = await api.emulator.create({ organizationUid: opts.organizationUid! });

		createProps.deviceUid = device.uid;
	});

	after('remove device', async function () {
		await api.emulator.delete(device.uid);
	});

	describe('CREATE', function () {
		it('should create a new timing as finishEvent data null', async function () {
			const timing = await api.timing.create(createProps);

			// save for later tests
			timingUid = timing.uid;

			should(timing).be.containDeep(createProps);
			should(timing.uid).be.ok();
			should(timing.updatedAt).be.ok();
		});

		it('should create new timing without identification', async function () {
			const props = { ...createProps, configuration: {} };
			const timing = await api.timing.create(props);

			// save for later tests
			timingUidWithoutIdentification = timing.uid;

			should(timing).be.containDeep(props);
			should(timing.uid).be.ok();
			should(timing.updatedAt).be.ok();
		});

		it('should create new timing with data as finishEvent object with any data', async function () {
			const props: ITimingCreateOnly & ITimingUpdatable = { ...createProps, finishEvent: { type: 'SCREEN_TAP', data: { a: 1 } } };
			const timing = await api.timing.create(props);

			// save for later tests
			timingUidWithFinishedEventObject = timing.uid;

			should(timing).be.containDeep(props);
			should(timing.uid).be.ok();
			should(timing.updatedAt).be.ok();
		});

		it('should create new timing with data as finishEvent string', async function () {
			const props: ITimingCreateOnly & ITimingUpdatable = { ...createProps, finishEvent: { type: 'SCREEN_TAP', data: 'string' } };
			const timing = await api.timing.create(props);

			// save for later tests
			timingUidWithFinishedEventString = timing.uid;

			should(timing).be.containDeep(props);
			should(timing.uid).be.ok();
			should(timing.updatedAt).be.ok();
		});

		it('should create new timing with encrypted configuration', async function () {
			const encryptedConfiguration = {
				encryptedData: 'jfnwijnfweiwbfweifbneiejnbfijewnf',
			};

			const props: ITimingCreateOnly & ITimingUpdatable = {
				...createProps,
				configuration: { identification: identification, encryptedConfiguration },
			};

			const timing = await api.timing.create(props);

			// save for later tests
			timingUidWithFinishedEventString = timing.uid;

			should(timing).be.containDeep(props);
			should(timing.uid).be.ok();
			should(timing.updatedAt).be.ok();
		});
	});

	describe('GET', function () {
		it('should get the list of existing timings', async () => {
			const timings = await api.timing.getList();
			should(timings).be.Array();
		});

		it('should get the timing by its uid', async function () {
			const timing = await api.timing.get(timingUid);
			should(timing).be.containDeep(createProps);
			should(timing.uid).be.ok();
			should(timing.updatedAt).be.ok();
		});

		it('should throw error if timing does not exist', async function () {
			try {
				await api.timing.get('non-existent-timing-uid');
			} catch (e: any) {
				should(e.errorCode).be.equal(404311);
				should(e.errorName).be.equal('RESOURCE_NOT_FOUND');
			}
		});

		it('should throw error when timing is not under specified organization', async function () {
			try {
				await api.timing.get('527a80735ad1fb8c1a3229103bb5734068e7');
			} catch (e: any) {
				should(e.errorCode).be.equal(404311);
				should(e.errorName).be.equal('RESOURCE_NOT_FOUND');
			}
		});
	});

	describe('UPDATE', async function () {
		it('should update the timing', async function () {
			const updateProps: ITimingUpdatable = {
				appletVersion: '1.0.0',
				startsAt: new Date('2023-04-01T12:00:00'),
				endsAt: new Date('2023-04-02T00:00:00'),
				configuration: { identification: identification },
				position: 1,
				finishEvent: { type: 'DURATION', data: 'event-data' },
			};

			const updatedTiming = await api.timing.update(timingUid, updateProps);

			should(updatedTiming).be.containDeep(updateProps);
			should(updatedTiming.uid).be.ok();
			should(updatedTiming.updatedAt).be.ok();
		});

		// TODO: consult the data null case and the comparator in TimingManagement
		it.skip('should update the timing with data null', async function () {
			const updateProps: ITimingUpdatable = {
				appletVersion: '1.0.0',
				startsAt: new Date('2023-04-01T12:00:00'),
				endsAt: new Date('2023-04-02T00:00:00'),
				configuration: { identification: identification },
				position: 1,
				finishEvent: { type: 'DURATION', data: null },
			};

			const updatedTiming = await api.timing.update(timingUid, updateProps);

			should(updatedTiming).be.containDeep(updateProps);
			should(updatedTiming.uid).be.ok();
			should(updatedTiming.updatedAt).be.ok();
		});

		it('should update timing without identification', async function () {
			const updateProps: ITimingUpdatable = {
				appletVersion: '1.0.0',
				startsAt: new Date('2023-04-01T12:00:00'),
				endsAt: new Date('2023-04-02T00:00:00'),
				configuration: {},
				position: 1,
				finishEvent: { type: 'DURATION', data: 'event-data' },
			};

			const updatedTiming = await api.timing.update(timingUidWithoutIdentification, updateProps);

			should(updatedTiming).be.containDeep(updateProps);
			should(updatedTiming.uid).be.ok();
			should(updatedTiming.updatedAt).be.ok();
		});

		it('should update timing with data as finishEvent object with any data', async function () {
			const updateProps: ITimingUpdatable = {
				appletVersion: '1.0.0',
				startsAt: new Date('2023-04-01T12:00:00'),
				endsAt: new Date('2023-04-02T00:00:00'),
				configuration: { identification: identification },
				position: 1,
				finishEvent: { type: 'SCREEN_TAP', data: { a: 1 } },
			};

			const updatedTiming = await api.timing.update(timingUidWithFinishedEventObject, updateProps);

			should(updatedTiming).be.containDeep(updateProps);
			should(updatedTiming.uid).be.ok();
			should(updatedTiming.updatedAt).be.ok();
		});

		it('should update timing with data as finishEvent string', async function () {
			const updateProps: ITimingUpdatable = {
				appletVersion: '1.0.0',
				startsAt: new Date('2023-04-01T12:00:00'),
				endsAt: new Date('2023-04-02T00:00:00'),
				configuration: { identification: identification },
				position: 1,
				finishEvent: { type: 'SCREEN_TAP', data: 'string' },
			};

			const updatedTiming = await api.timing.update(timingUidWithFinishedEventString, updateProps);

			should(updatedTiming).be.containDeep(updateProps);
			should(updatedTiming.uid).be.ok();
			should(updatedTiming.updatedAt).be.ok();
		});

		it('should throw error if timing does not exist', async function () {
			try {
				await api.timing.update('non-existent-timing-uid', {
					appletVersion: '1.0.0',
					startsAt: new Date('2023-04-01T12:00:00'),
					endsAt: new Date('2023-04-02T00:00:00'),
					configuration: { identification: identification },
					position: 1,
					finishEvent: { type: 'DURATION', data: null },
				});
			} catch (e: any) {
				should(e.errorCode).be.equal(404311);
				should(e.errorName).be.equal('RESOURCE_NOT_FOUND');
			}
		});

		it('should throw error when timing is not under specified organization', async function () {
			try {
				await api.timing.update('527a80735ad1fb8c1a3229103bb5734068e7', {
					appletVersion: '1.0.0',
					startsAt: new Date('2023-04-01T12:00:00'),
					endsAt: new Date('2023-04-02T00:00:00'),
					configuration: { identification: identification },
					position: 1,
					finishEvent: { type: 'DURATION', data: null },
				});
			} catch (e: any) {
				should(e.errorCode).be.equal(404311);
				should(e.errorName).be.equal('RESOURCE_NOT_FOUND');
			}
		});
	});

	describe('DELETE', function () {
		it('should delete the timing', async function () {
			await api.timing.delete(timingUid);
			try {
				await api.timing.get(timingUid);
			} catch (e: any) {
				should(e.errorCode).be.equal(404311);
			}

			// no need to assert anything because it was asserted above
			await api.timing.delete(timingUidWithoutIdentification);
			await should(api.timing.get(timingUidWithoutIdentification)).be.rejected();

			await api.timing.delete(timingUidWithFinishedEventObject);
			await should(api.timing.get(timingUidWithFinishedEventObject)).be.rejected();

			await api.timing.delete(timingUidWithFinishedEventString);
			await should(api.timing.get(timingUidWithFinishedEventString)).be.rejected();
		});

		it('should not delete non-existent timing', async function () {
			try {
				await api.timing.delete('non-existent-timing-uid');
			} catch (e: any) {
				should(e.errorCode).be.equal(403099);
				should(e.errorName).be.equal('NO_TIMING_TO_DELETE');
			}
		});

		it('should throw error when timing is not under specified organization', async function () {
			try {
				await api.timing.delete('527a80735ad1fb8c1a3229103bb5734068e7');
			} catch (e: any) {
				should(e.errorCode).be.equal(403067);
				should(e.errorName).be.equal('NO_OWN_TIMING_TO_DELETE');
			}
		});
	});
});
