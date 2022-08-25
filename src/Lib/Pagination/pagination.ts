interface ISort {
	descending?: boolean;
}

interface ILinkPagination {
	limit?: number;
}

export type TPagination = ILinkPagination;

export interface IPaginationAndSort {
	sort?: ISort;
	pagination?: TPagination;
}
