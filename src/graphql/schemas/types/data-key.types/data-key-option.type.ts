import { objectType } from "nexus";

export const DataKeyOption = objectType({
	name: "DataKeyOption",
	description: "A single data key option that can be selected for a stock portfolio header",
	definition: (t) => {
		t.string("name", { description: "A more normal name. This can be shown to users." });
		t.string("dataKey", {
			description: "A unique data key for fetching stock portfolio data"
		});
		t.string("description", {
			description: "A description of the data that is fetched with this data key"
		});
		t.field("provider", {
			type: "DataKey_Provider",
			description: "The name of the provider"
		});
	}
});
