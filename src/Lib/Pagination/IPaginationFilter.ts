export interface IPaginationFilter {
	/** Maximum number of items per page (API enforces limits). */
	limit?: number;

	/** Sort in descending order. @default true */
	descending?: boolean;
}
