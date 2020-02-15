import { DocumentNode } from "graphql";
import AuthenticationSchema from "./authentication.schema.graphql";
import ConnectionSchema from "./connection.schema.graphql";
import DataKeySchema from "./data-key.schema.graphql";
import DirectivesSchema from "./directives.schema.graphql";
import GeneralInputsSchema from "./general-inputs.schema.graphql";
import RootSchema from "./root.graphql";
import ScalarsSchema from "./scalars.schema.graphql";
import StockPortfolioSchema from "./stock-portfolio.schema.graphql";
import UserSchema from "./user.schema.graphql";

export const typeDefs: DocumentNode[] = [
	RootSchema,
	AuthenticationSchema,
	ConnectionSchema,
	DataKeySchema,
	DirectivesSchema,
	GeneralInputsSchema,
	ScalarsSchema,
	StockPortfolioSchema,
	UserSchema
];
