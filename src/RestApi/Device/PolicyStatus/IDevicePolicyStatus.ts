export default interface IDevicePolicyStatus {
	deviceUid: string;
	policyUid: string;
	itemType: string;
	success: boolean;
	updatedAt: Date;
}
