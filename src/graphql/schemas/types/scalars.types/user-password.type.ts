import { genSaltSync, hashSync } from "bcryptjs";
import { GraphQLError, Kind, ValueNode } from "graphql";
import { scalarType } from "nexus";

const BCRYPT_SALT_ROUNDS = 10;

const hashPassword = (password: string): string => {
	const salt: string = genSaltSync(BCRYPT_SALT_ROUNDS);
	const hash: string = hashSync(password, salt);

	return hash;
};

export const UserPassword = scalarType({
	name: "UserPassword",
	description: "The plain-text password of a user to be hashed",
	serialize: (value) => value,
	parseValue: (value: string) => {
		if (typeof value !== "string") {
			throw new TypeError(`Value is not a valid string: ${value}`);
		}

		return hashPassword(value);
	},
	parseLiteral: (ast: ValueNode) => {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(
				`Can only parse strings to password-hashes, but got a: ${ast.kind}`
			);
		}

		return hashPassword(ast.value);
	}
});
