import { Logger } from "@/utils";

export const logOperation = (
	sourceName: string,
	op: string,
	filter: { [key: string]: any }
): typeof Logger | null =>
	process.env.NODE_ENV === "development"
		? Logger.info(`Dataloader - ${sourceName} ${op}: ${JSON.stringify(filter)}`)
		: null;
