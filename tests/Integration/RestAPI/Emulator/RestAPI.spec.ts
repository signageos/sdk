import * as should from 'should';
import { Api } from "../../../../src/index";
import Emulator from '../../../../src/RestApi/Emulator/Emulator';
import { opts, RUN_INTEGRATION_TESTS } from "../helper";

const api = new Api(opts);

describe('RestAPI - Emulator', () => {
	before(function () {
		// in order to run these tests, fill in auth and RUN_INTEGRATION_TESTS environment variables (please see '../helper.ts' file)
		if (!RUN_INTEGRATION_TESTS || (opts.accountAuth as any).tokenId === '' || (opts.accountAuth as any).token === '') {
			console.warn('you must set auth details in order to run this test');
			this.skip();
		}
	});

	it('should create new emulator', async () => {
		await api.emulator.create({ organizationUid: opts.organizationUid });
		should(true).be.true();
	});

	it('should get list of emulators', async () => {
		const [emulator] = await api.emulator.list();
		should(emulator instanceof Emulator).be.true();
		should(emulator.uid).be.not.empty();
		should(emulator.duid).be.not.empty();
		should(emulator.name).be.not.empty();
		should(emulator.createdAt instanceof Date).be.true();
	});
});
