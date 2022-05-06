import { fromBuffer } from 'file-type';

// TODO: Copied from @signageos/lib, we can add this lib to dependencies ?
export const getFileExtension = async (file: Buffer) => {
	const fileType = await fromBuffer(file);
	const extension = fileType?.ext ?? fileType?.mime;

	return extension;
};
