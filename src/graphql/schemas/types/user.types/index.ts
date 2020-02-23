import { objectType } from "nexus";

export const User = objectType({
	name: "User",
	description: "Basic user of the application",
	definition: (t) => {
		t.id("id", { description: "The id of the user" });
		t.field("email", {
			type: "EmailAddress",
			description: "The user's email"
		});
		t.boolean("emailVerified", {
			description: "Whether the user verified their email address"
		});
		t.string("username", { description: "The user's username" });
	}
});
