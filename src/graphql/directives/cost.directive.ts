import { GraphQLField } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";

export class CostDirective extends SchemaDirectiveVisitor {
	public visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> {
		const withComplexity: GraphQLField<any, any> = {
			...field,
			extensions: {
				...field.extensions,
				complexity: ({ args, childComplexity }) => {
					const { multipliers = [], complexity } = this.args;

					const multiplier: number = multipliers.reduce((acc, key) => {
						const value: number = Math.max(Math.floor(Number(args[key])), 1);

						return value * acc;
					}, 1);

					const fieldComplexity: number = multiplier * childComplexity;
					const totalComplexity: number = complexity + fieldComplexity;

					return totalComplexity;
				}
			}
		};

		return withComplexity;
	}
}
