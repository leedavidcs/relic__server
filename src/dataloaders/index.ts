import { stockPortfolio, stockPortfolioById } from "./stock-portfolio.dataloader";
import { userById } from "./user.dataloader";

export * from "./utils";

export const getLoaders = () => ({
	stockPortfolio: stockPortfolio(),
	stockPortfolioById: stockPortfolioById(),
	userById: userById()
});
