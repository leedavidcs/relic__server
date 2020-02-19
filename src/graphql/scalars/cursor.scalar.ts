import Base64URL from "base64-url";
import { GraphQLScalarType, Kind, ValueNode } from "graphql";

const toCursor = ({ value }): string => Base64URL.encode(value.toString());

const fromCursor = (cursor: string): { value: string } | null => {
	const value: string = Base64URL.decode(cursor);

	return value ? { value } : null;
};

export const Cursor: GraphQLScalarType = new GraphQLScalarType({
	name: "Cursor",
	serialize: (value) => (value.value ? toCursor(value) : null),
	parseLiteral: (ast: ValueNode) => (ast.kind === Kind.STRING ? fromCursor(ast.value) : null),
	parseValue: fromCursor
});
