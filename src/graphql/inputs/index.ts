export interface IConnectionInput {
	someOf?: string[];
	allOf?: string[];
	size?: number;
	empty?: boolean;
}

export interface IDateTimeInput {
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
	day?: number;
	month?: number;
	year: number;
}

export interface IVariableDateTimeInput {
	before?: IDateTimeInput;
	after?: IDateTimeInput;
	equal?: IDateTimeInput;
}
