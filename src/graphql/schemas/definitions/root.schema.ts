import { mutationType, objectType, queryType } from "nexus";

export const Viewer = objectType({
	name: "Viewer",
	description: "The viewer of this request",
	definition: (t) => {
		t.id("id", { description: "The viewer's id" });
		t.string("email", { description: "The viewer's email" });
		t.boolean("emailVerified", {
			description: "Whether this viewer verified their email address"
		});
		t.string("username", { description: "The viewer's username" });
	}
});

export const Mutation = mutationType({
	description: "Root mutation type",
	definition: (t) => {
		t.field("viewer", {
			type: Viewer,
			nullable: true,
			description: "The viewer of this request"
		});
	}
});

export const Query = queryType({
	description: "Root query type",
	definition: (t) => {
		t.field("viewer", {
			type: Viewer,
			nullable: true,
			description: "The viewer of this request"
		});
	}
});
