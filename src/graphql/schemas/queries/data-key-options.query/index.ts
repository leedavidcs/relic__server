import { queryField, stringArg } from "nexus";
import { getDataKeyOptions } from "./get-data-key-options";

export const dataKeyOptions = queryField("dataKeyOptions", {
	type: "DataKeyOption",
	list: true,
	nullable: false,
	description:
		"Retrieves the list of data key options for a stock portfolio header. All filters are \
		OR'ed.",
	args: {
		name: stringArg({ description: "Filter by name (partial works)" }),
		dataKey: stringArg({ description: "Filter by dataKey (partial works)" }),
		provider: stringArg({ description: "Filter by provider (partial works)" })
	},
	resolve: (parent, args) => getDataKeyOptions(args)
});
