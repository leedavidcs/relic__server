import { IServerContext } from "@/graphql/context";
import { IStockPortfolioHeader } from "@/mongodb";
import { IMiddlewareGenerator } from "graphql-middleware";
import { uniqBy } from "lodash";
import { guardRails } from "./guard-rails";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;

export const validation: IMiddlewareGenerator<any, IServerContext, any> = guardRails((yup) => ({
	Mutation: {
		registerLocalUser: {
			username: yup
				.string()
				.min(USERNAME_MIN_LENGTH)
				.max(USERNAME_MAX_LENGTH)
				.matches(/^[a-z0-9_.-]*$/i)
		},
		updateStockPortfolio: {
			headers: yup
				.string()
				.test(
					"uniqueBy",
					"Headers must have unique names",
					(headers: readonly IStockPortfolioHeader[]) => {
						const hasUniqNames: boolean =
							uniqBy(headers, "name").length === headers.length;

						return hasUniqNames;
					}
				)
		}
	}
}));
