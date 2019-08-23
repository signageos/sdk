
export interface IAppletVersionListFilter {
	frontAppletVersion?: string;
}

interface IAppletVersionFilter extends IAppletVersionListFilter {
	version?: string;
}

export default IAppletVersionFilter;
