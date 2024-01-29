export interface IDeviceAppletTest {
	appletUid: string;
	appletVersion: string;
	deviceUid: string;
	createdAt: Date;
	finishedAt: Date | null;
	pendingTests: string[];
	successfulTests: string[];
	failedTests: string[];
}

export default IDeviceAppletTest;
