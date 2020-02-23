import { DataKeys } from "@/mongodb";
import { enumType } from "nexus";

export const DataKey = enumType({
	name: "DataKey",
	description:
		"The dataKey property of a stock portfolio header, that determines what data is pulled",
	members: DataKeys
});
