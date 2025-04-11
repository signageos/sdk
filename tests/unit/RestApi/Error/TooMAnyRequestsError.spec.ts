import should from 'should';
import TooMAnyRequestsError from '../../../../src/RestApi/Error/TooMAnyRequestsError';

describe('RestApi.Error.TooMAnyRequestsError', () => {
	describe('instanceof TooMAnyRequestsError', () => {
		it('should return true', function () {
			const error = new TooMAnyRequestsError(503, 'test');
			should(error).be.instanceOf(TooMAnyRequestsError);
		});
	});
});
