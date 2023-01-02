import * as should from 'should';
import { checkAppletVersionUpdatable, checkAppletVersionCreatable } from '../../../../../src/RestApi/Applet/Version/AppletVersionValidator';

describe('AppletVersionValidator', () => {

	describe('checkAppletVersionUpdatable', () => {

		it('should pass with only binary', () => {
			checkAppletVersionUpdatable({
				binary: '<h1>Test applet</h1>',
				frontAppletVersion: '1.1.1',
			});
		});

		it('should pass with only entryFile', () => {
			checkAppletVersionUpdatable({
				entryFile: 'src/index.html',
				frontAppletVersion: '1.1.1',
			});
		});

		it('should fail with both binary and entryFile', () => {
			let failed = false;
			try {
				checkAppletVersionUpdatable({
					binary: '<h1>Test applet</h1>',
					entryFile: 'src/index.html',
					frontAppletVersion: '1.1.1',
				});
			} catch (error) {
				failed = true;
			}
			should.deepEqual(failed, true);
		});
	});

	describe('checkAppletVersionCreatable', () => {

		it('should pass with only binary', () => {
			checkAppletVersionCreatable({
				binary: '<h1>Test applet</h1>',
				frontAppletVersion: '1.1.1',
				version: '2.2.2',
			});
		});

		it('should pass with only entryFile', () => {
			checkAppletVersionCreatable({
				entryFile: 'src/index.html',
				frontAppletVersion: '1.1.1',
				version: '2.2.2',
			});
		});

		it('should fail with both binary and entryFile', () => {
			let failed = false;
			try {
				checkAppletVersionCreatable({
					binary: '<h1>Test applet</h1>',
					entryFile: 'src/index.html',
					frontAppletVersion: '1.1.1',
					version: '2.2.2',
				});
			} catch (error) {
				failed = true;
			}
			should.deepEqual(failed, true);
		});

		it('should fail with missing binary and entryFile', () => {
			let failed = false;
			try {
				checkAppletVersionCreatable({
					frontAppletVersion: '1.1.1',
					version: '2.2.2',
				});
			} catch (error) {
				failed = true;
			}
			should.deepEqual(failed, true);
		});
	});
});
