import { DataKeys } from "@/mongodb";
import { enumType, objectType, queryField, stringArg } from "nexus";
import { getDataKeyOptions } from "./get-data-key-options";

export const DataKey = enumType({
	name: "DataKey",
	description:
		"The dataKey property of a stock portfolio header, that determines what data is pulled",
	members: DataKeys
});

export const DataKey_Provider = enumType({
	name: "DataKey_Provider",
	description: "The provider for the data provided by the data key",
	members: [
		{
			description: "IEX Cloud (see `https://iexcloud.io/`)",
			name: "IEX_CLOUD",
			value: "IEX_CLOUD"
		}
	]
});

export const DataKeyOption = objectType({
	name: "DataKeyOption",
	description: "A single data key option that can be selected for a stock portfolio header",
	definition: (t) => {
		t.string("name", { description: "A more normal name. This can be shown to users." });
		t.field("dataKey", {
			type: DataKey,
			description: "A unique data key for fetching stock portfolio data"
		});
		t.string("description", {
			description: "A description of the data that is fetched with this data key"
		});
		t.field("provider", {
			type: DataKey_Provider,
			description: "The name of the provider"
		});
	}
});

export const dataKeyOptions = queryField("dataKeyOptions", {
	type: DataKeyOption,
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
