// TODO: Copied from @signageos/lib, we can add this lib to dependencies ?
export const getFileExtension = async (file: Buffer) => {
	// Dynamic import to handle ESM-only file-type package in CommonJS environment
	const { fileTypeFromBuffer } = await import('file-type');
	const fileType = await fileTypeFromBuffer(file);
	const extension = fileType?.ext ?? fileType?.mime;

	return extension;
};
