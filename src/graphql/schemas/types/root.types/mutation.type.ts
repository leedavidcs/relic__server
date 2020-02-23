import { mutationType } from "nexus";

export const Mutation = mutationType({
	description: "Root mutation type",
	definition: (t) => {
		t.implements("RequestRoot");
	}
});
