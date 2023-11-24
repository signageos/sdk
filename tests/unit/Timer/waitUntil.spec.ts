import * as should from 'should';
import wait from '../../../src/Timer/wait';
import waitUntilTrue, { waitUntilResolved } from '../../../src/Timer/waitUntil';

describe('Timer.waitUntil', function () {
	describe('waitUntilTrue', function () {
		it('should wait until callback value is true', async function () {
			let value = false;
			let resolved = false;
			const promise = waitUntilTrue(async () => value, 50);
			promise.then(() => (resolved = true));
			await wait(100);
			should(resolved).false();
			value = true;
			await wait(100);
			should(resolved).true();
		});
	});

	describe('waitUntilResolved', function () {
		it('should wait until callback is not rejecting', async function () {
			let callbackPromise: Promise<void> = Promise.reject(new Error('Not yet'));
			let resolved = false;
			const promise = waitUntilResolved(() => callbackPromise);
			promise.then(() => (resolved = true));
			await wait(600);
			should(resolved).false();
			callbackPromise = Promise.resolve();
			await wait(600);
			should(resolved).true();
		});
	});
});
