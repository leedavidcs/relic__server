import { stockPortfolioById } from "./stock-portfolio.dataloader";
import { userById } from "./user.dataloader";

export const getLoaders = () => ({
	stockPortfolioById: stockPortfolioById(),
	userById: userById()
});
