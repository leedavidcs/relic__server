import { Cursor, DataKey, JSONObject, PageInfo, User } from "@/graphql/schemas/types";
import { arg, inputObjectType, intArg, mutationField, objectType, queryField } from "nexus";
import { getStockPortfolioData } from "./get-stock-portfolio-data";

export const StockPortfolio = objectType({
	name: "StockPortfolio",
	description: "StockPortfolio entity. This is what gets shown on the data grid",
	definition: (t) => {
		t.id("id", {
			nullable: false,
			description: "The ID of the stock portfolio"
		});
		t.field("user", {
			type: User,
			nullable: false,
			description: "The user that this stock portfolio belongs to. Also the creator",
			complexity: 1
		});
		t.string("name", { description: "The name, the user has given to this stock portfolio" });
		t.list.field("headers", {
			type: StockPortfolioHeader,
			nullable: false,
			description: "The headers (configs) for this data grid, including how data is resolved"
		});
		t.list.string("tickers", {
			nullable: false,
			description: "The tickers that are the rows for this data grid"
		});
		t.field("data", {
			type: JSONObject,
			nullable: false,
			description: "The data that gets resolved based on headers and tickers",
			resolve: (parent, args) => getStockPortfolioData(parent, args)
		});
	}
});

export const StockPortfolioConnection = objectType({
	name: "StockPortfolioConnection",
	description:
		"The stock portfolio connection, from which pagination and resource info can be gotten",
	definition: (t) => {
		t.list.field("edges", {
			type: StockPortfolioEdge,
			nullable: false,
			description: "Holds cursor and resource information"
		});
		t.list.field("nodes", {
			type: StockPortfolio,
			nullable: false,
			description: "Convenience property to avoid nesting"
		});
		t.field("pageInfo", {
			type: PageInfo,
			nullable: false,
			description: "Pagination info, on whether there is more data"
		});
	}
});

export const StockPortfolioEdge = objectType({
	name: "StockPortfolioEdge",
	description: "Connection edges, which hold cursor and resource information",
	definition: (t) => {
		t.field("cursor", {
			type: Cursor,
			nullable: false,
			description: "Cursor for pagination"
		});
		t.field("node", {
			type: StockPortfolio,
			nullable: false,
			description: "The actual stock portfolio data"
		});
	}
});

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	description: "A column configuration for the stock portfolio on the data grid",
	definition: (t) => {
		t.string("name", {
			description: "The name displayed for this column header",
			nullable: false
		});
		t.field("dataKey", {
			type: DataKey,
			description: "The dataKey, which determines how values in this column are resolved"
		});
		t.int("width", {
			description: "The configured width of this column",
			nullable: false
		});
		t.boolean("frozen", {
			description: "Whether this column could be moved",
			nullable: false
		});
		t.boolean("resizable", {
			description: "Whether this column could be resized",
			nullable: false
		});
	}
});

export const StockPortfolioHeaderInput = inputObjectType({
	name: "StockPortfolioHeaderInput",
	definition: (t) => {
		t.string("name", { required: true });
		t.string("dataKey", { required: true });
		t.int("width", { required: true });
		t.list.string("tickers", { required: true });
	}
});

export const CreateStockPortfolioInput = inputObjectType({
	name: "CreateStockPortfolioInput",
	definition: (t) => {
		t.string("name", {
			description: "(Unique) The name of this stock portfolio.",
			default: "New_Portfolio"
		});
	}
});

export const CreateStockPortfolioPayload = objectType({
	name: "CreateStockPortfolioPayload",
	definition: (t) => {
		t.field("stockPortfolio", {
			nullable: false,
			type: StockPortfolio
		});
	}
});

export const UpdateStockPortfolioInput = inputObjectType({
	name: "UpdateStockPortfolioInput",
	definition: (t) => {
		t.id("id", {
			required: true,
			description: "The ID of the stock portfolio to update"
		});
		t.list.field("headers", {
			type: StockPortfolioHeaderInput,
			description: "Headers for this data grid, including how data is resolved"
		});
		t.list.string("tickers", {
			description: "The tickers that are the rows for this data grid"
		});
	}
});

export const UpdateStockPortfolioPayload = objectType({
	name: "UpdateStockPortfolioPayload",
	definition: (t) => {
		t.field("stockPortfolio", {
			nullable: false,
			type: StockPortfolio
		});
	}
});

export const DeleteStockPortfolioInput = inputObjectType({
	name: "DeleteStockPortfolioInput",
	definition: (t) => {
		t.id("id", {
			required: true,
			description: "Id of the stock portfolio to delete"
		});
	}
});

export const DeleteStockPortfolioPayload = objectType({
	name: "DeleteStockPortfolioPayload",
	definition: (t) => {
		t.field("stockPortfolio", {
			nullable: false,
			type: StockPortfolio
		});
	}
});

export const stockPortfolios = queryField("stockPortfolios", {
	type: StockPortfolioConnection,
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
			type: Cursor,
			description: "A cursor to specify before which item a search should occur"
		}),
		after: arg({
			type: Cursor,
			description: "A cursor to specify after which item a search should occur"
		})
	},
	complexity: ({ args: { first }, childComplexity }) => first! * childComplexity
});

export const createStockPortfolio = mutationField("createStockPortfolio", {
	type: CreateStockPortfolioPayload,
	args: {
		input: arg({
			type: CreateStockPortfolioInput,
			required: true
		})
	},
	complexity: 1
});

export const updateStockPortfolio = mutationField("updateStockPortfolio", {
	type: UpdateStockPortfolioPayload,
	args: {
		input: arg({
			type: UpdateStockPortfolioInput,
			required: true
		})
	},
	complexity: 1
});

export const deleteStockPortfolio = mutationField("deleteStockPortfolio", {
	type: DeleteStockPortfolioPayload,
	args: {
		input: arg({
			type: DeleteStockPortfolioInput,
			required: true
		})
	},
	complexity: 1
});
