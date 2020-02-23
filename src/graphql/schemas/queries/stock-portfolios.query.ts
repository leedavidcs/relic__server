import { arg, intArg, queryField } from "nexus";

export const stockPortfolios = queryField("stockPortfolios", {
	type: "StockPortfolioConnection",
	args: {
		first: intArg({
			description: "A limit of how many items to grab after the `after` cursor",
			default: 50
		}),
		last: intArg({
			description:
				"A limit of how many items to grab before the end bound of the paginated \
				search (the smaller of `before` or `first`"
		}),
		before: arg({
			type: "Cursor",
			description: "A cursor to specify before which item a search should occur"
		}),
		after: arg({
			type: "Cursor",
			description: "A cursor to specify after which item a search should occur"
		})
	},
	complexity: ({ args: { first }, childComplexity }) => first! * childComplexity
});
