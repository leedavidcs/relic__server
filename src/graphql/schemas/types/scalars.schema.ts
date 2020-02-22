import { Cursor as CursorResolver, UserPassword as UserPasswordResolver } from "@/graphql/scalars";
import { EmailAddressResolver, JSONObjectResolver } from "graphql-scalars";
import { scalarType } from "nexus";

export const Cursor = scalarType({
	name: "Cursor",
	description: "Pagination cursor. Use this to fetch items before or after an item",
	serialize: CursorResolver.serialize,
	parseValue: CursorResolver.parseValue,
	parseLiteral: CursorResolver.parseLiteral
});

export const EmailAddress = scalarType({
	name: "EmailAddress",
	description: EmailAddressResolver.description,
	serialize: EmailAddressResolver.serialize,
	parseValue: EmailAddressResolver.parseValue,
	parseLiteral: EmailAddressResolver.parseLiteral
});

export const JSONObject = scalarType({
	name: "JSON",
	description: JSONObjectResolver.description,
	serialize: JSONObjectResolver.serialize,
	parseValue: JSONObjectResolver.parseValue,
	parseLiteral: JSONObjectResolver.parseLiteral
});
export const UserPassword = scalarType({
	name: "UserPassword",
	description: "A plain-text string of a user's password, that gets hashed when parsed.",
	serialize: UserPasswordResolver.serialize,
	parseValue: UserPasswordResolver.parseValue,
	parseLiteral: UserPasswordResolver.parseLiteral
});
