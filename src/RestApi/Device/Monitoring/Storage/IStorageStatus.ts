export interface IStorageSpace {
	capacity: number;
	freeSpace: number;
}

interface IStorageStatus {
	internal: IStorageSpace;
	removable: IStorageSpace;
	updatedAt: Date;
}

export default IStorageStatus;
