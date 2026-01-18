import should from 'should';
import { formatBytes } from '../../../../../src/Development/Applet/Serve/appletServerHelper';

describe('Development.Applet.Serve.appletServerHelper', function () {
	describe('formatBytes', function () {
		it('should return "0 B" for zero bytes', function () {
			should(formatBytes(0)).equal('0 B');
		});

		it('should format bytes without decimals', function () {
			should(formatBytes(1)).equal('1 B');
			should(formatBytes(512)).equal('512 B');
			should(formatBytes(1023)).equal('1023 B');
		});

		it('should format kilobytes with 2 decimals', function () {
			should(formatBytes(1024)).equal('1.00 KB');
			should(formatBytes(1536)).equal('1.50 KB');
			should(formatBytes(10240)).equal('10.00 KB');
		});

		it('should format megabytes with 2 decimals', function () {
			should(formatBytes(1048576)).equal('1.00 MB');
			should(formatBytes(5242880)).equal('5.00 MB');
		});

		it('should format gigabytes with 2 decimals', function () {
			should(formatBytes(1073741824)).equal('1.00 GB');
			should(formatBytes(2147483648)).equal('2.00 GB');
		});

		it('should clamp to GB for values larger than TB', function () {
			// 1 TB = 1099511627776 bytes, should still show as GB since TB unit is not defined
			should(formatBytes(1099511627776)).equal('1024.00 GB');
		});
	});
});
