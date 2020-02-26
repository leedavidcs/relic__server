import { objectType } from "nexus";

export const User = objectType({
	name: "User",
	description: "Basic user of the application",
	definition: (t) => {
		t.model.id();
		t.field("email", { type: "EmailAddress", description: "The user's email" });
		t.model.emailVerified();
		t.model.username();
		t.model.createdAt();
		t.model.updatedAt();
	}
});
