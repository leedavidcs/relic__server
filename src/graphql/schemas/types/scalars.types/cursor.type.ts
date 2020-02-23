import Base64URL from "base64-url";
import { Kind, ValueNode } from "graphql";
import { scalarType } from "nexus";

const toCursor = ({ value }): string => Base64URL.encode(value.toString());

const fromCursor = (cursor: string): { value: string } | null => {
	const value: string = Base64URL.decode(cursor);

	return value ? { value } : null;
};

export const Cursor = scalarType({
	name: "Cursor",
	description: "Pagination cursor. Use this to fetch items before or after an item",
	serialize: (value) => (value.value ? toCursor(value) : null),
	parseLiteral: (ast: ValueNode) => (ast.kind === Kind.STRING ? fromCursor(ast.value) : null),
	parseValue: fromCursor
});
