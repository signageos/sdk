// TODO - merge all filters into one
export interface ICreatedDateRangeFilter {
	createdSince?: Date;
	createdUntil?: Date;
}

// TODO - merge all filters into one
export interface IDateRangeFilter {
	from?: Date;
	to?: Date;
}

// TODO - merge all filters into one
export interface ITakenDateRangeFilter {
	takenSince?: Date;
	takenUntil?: Date;
}
