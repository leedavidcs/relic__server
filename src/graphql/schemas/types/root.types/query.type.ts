import { queryType } from "nexus";

export const Query = queryType({
	description: "Root query type",
	definition: (t) => {
		t.implements("RequestRoot");
	}
});
