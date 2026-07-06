import should from 'should';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import sinon from 'sinon';
import { AppletIdentificationManagement } from '../../../../../src/Development/Applet/Identification/AppletIdentificationManagement';
import { MultipleAppletFoundError } from '../../../../../src/SosHelper/errors';

describe('Development.Applet.Identification.AppletIdentificationManagement', function () {
	let tmpDir: string;

	beforeEach(async function () {
		tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sdk-test-identification-'));
		await fs.writeJson(path.join(tmpDir, 'package.json'), {
			name: '@signageos/test-applet',
			version: '1.2.3',
		});
	});

	afterEach(async function () {
		await fs.remove(tmpDir);
	});

	function createIdentificationManagement(applets: { uid: string; name: string }[]) {
		const restApiV1 = {
			applet: {
				list: sinon.stub().resolves(applets),
			},
		} as any;
		return new AppletIdentificationManagement(restApiV1);
	}

	describe('getAppletUidAndVersion', function () {
		it('should resolve applet by name from package.json', async function () {
			const identification = createIdentificationManagement([{ uid: 'uid-1', name: '@signageos/test-applet' }]);
			const result = await identification.getAppletUidAndVersion(tmpDir);
			should(result).deepEqual({ appletUid: 'uid-1', appletVersion: '1.2.3' });
		});

		it('should throw MultipleAppletFoundError when multiple applets have the same name', async function () {
			const identification = createIdentificationManagement([
				{ uid: 'uid-1', name: '@signageos/test-applet' },
				{ uid: 'uid-2', name: '@signageos/test-applet' },
			]);
			await identification.getAppletUidAndVersion(tmpDir).should.be.rejectedWith(MultipleAppletFoundError);
		});

		it('should skip lookup by name when appletUid override is provided', async function () {
			const identification = createIdentificationManagement([
				{ uid: 'uid-1', name: '@signageos/test-applet' },
				{ uid: 'uid-2', name: '@signageos/test-applet' },
			]);
			const result = await identification.getAppletUidAndVersion(tmpDir, { appletUid: 'uid-2' });
			should(result).deepEqual({ appletUid: 'uid-2', appletVersion: '1.2.3' });
		});

		it('should use appletVersion override when provided', async function () {
			const identification = createIdentificationManagement([]);
			const result = await identification.getAppletUidAndVersion(tmpDir, {
				appletUid: 'uid-2',
				appletVersion: '9.9.9',
			});
			should(result).deepEqual({ appletUid: 'uid-2', appletVersion: '9.9.9' });
		});
	});
});
