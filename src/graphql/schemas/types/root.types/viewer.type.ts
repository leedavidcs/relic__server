import { objectType } from "nexus";

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
