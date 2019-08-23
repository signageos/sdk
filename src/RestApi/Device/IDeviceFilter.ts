
interface IDeviceFilter {
	applicationType?: string;
	search?: string;
	model?: string;
	minStorageStatusPercentage?: number;
	maxStorageStatusPercentage?: number;
}
export default IDeviceFilter;
