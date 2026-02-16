import should from 'should';
import * as fs from 'fs-extra';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';
import sinon from 'sinon';
import { formatBytes, startAppletServer } from '../../../../../src/Development/Applet/Serve/appletServerHelper';
import { SOS_CONFIG_LOCAL_FILENAME } from '../../../../../src/Development/runtimeFileSystem';
import * as logModule from '../../../../../src/Console/log';

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

	describe('GET /config endpoint', function () {
		const appletUid = 'test-config-applet';
		const appletVersion = '1.0.0';
		let stopServer: () => Promise<void>;
		let logStub: sinon.SinonStub;
		let tmpDir: string;
		const port = 18099;

		beforeEach(async function () {
			logStub = sinon.stub(logModule, 'log');
			tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sdk-test-config-'));
		});

		afterEach(async function () {
			if (stopServer) {
				await stopServer();
			}
			logStub.restore();
			await fs.remove(tmpDir);
		});

		function httpGet(url: string): Promise<{ statusCode: number; body: string }> {
			return new Promise((resolve, reject) => {
				http
					.get(url, (res) => {
						let data = '';
						res.on('data', (chunk) => (data += chunk));
						res.on('end', () => resolve({ statusCode: res.statusCode!, body: data }));
					})
					.on('error', reject);
			});
		}

		it('should return config JSON when sos.config.local.json exists in applet directory', async function () {
			const configContent = { apiKey: 'test-key', debug: true, timeout: 5000 };
			const configPath = path.join(tmpDir, SOS_CONFIG_LOCAL_FILENAME);
			await fs.writeFile(configPath, JSON.stringify(configContent));

			const server = await startAppletServer({ appletUid, appletVersion, port, appletPath: tmpDir });
			stopServer = server.stopServer;

			const response = await httpGet(`http://localhost:${port}/config`);
			should(response.statusCode).equal(200);
			should(JSON.parse(response.body)).deepEqual(configContent);
		});

		it('should return empty object when no config file exists', async function () {
			const server = await startAppletServer({ appletUid, appletVersion, port, appletPath: tmpDir });
			stopServer = server.stopServer;

			const response = await httpGet(`http://localhost:${port}/config`);
			should(response.statusCode).equal(200);
			should(JSON.parse(response.body)).deepEqual({});
		});

		it('should return empty object when config file contains invalid JSON', async function () {
			const configPath = path.join(tmpDir, SOS_CONFIG_LOCAL_FILENAME);
			await fs.writeFile(configPath, '{ invalid json }');

			const server = await startAppletServer({ appletUid, appletVersion, port, appletPath: tmpDir });
			stopServer = server.stopServer;

			const response = await httpGet(`http://localhost:${port}/config`);
			should(response.statusCode).equal(200);
			should(JSON.parse(response.body)).deepEqual({});
		});

		it('should handle nested configuration objects', async function () {
			const configContent = {
				api: { key: 'test-key', endpoint: 'https://api.example.com' },
				features: { experimental: true },
			};
			const configPath = path.join(tmpDir, SOS_CONFIG_LOCAL_FILENAME);
			await fs.writeFile(configPath, JSON.stringify(configContent));

			const server = await startAppletServer({ appletUid, appletVersion, port, appletPath: tmpDir });
			stopServer = server.stopServer;

			const response = await httpGet(`http://localhost:${port}/config`);
			should(response.statusCode).equal(200);
			should(JSON.parse(response.body)).deepEqual(configContent);
		});
	});
});
