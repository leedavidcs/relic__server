export * from "./batch-by-id";
export * from "./batch-by-id-and-filters";

export interface IObjectFilterKey {
	id: string;
	[key: string]: any;
}

export interface IFilter {
	[key: string]: any;
}
