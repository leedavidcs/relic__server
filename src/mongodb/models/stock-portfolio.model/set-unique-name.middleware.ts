import { Model } from "mongoose";
import { IStockPortfolio } from "./schema";

/**
 * @description Retrieves the number suffix of a string. If the string does not end with a number,
 *     0 is returned instead.
 */
const getNumberSuffix = (str: string): number => {
	const matches = /\d+$/.exec(str);
	const numberSuffix: number = matches ? parseInt(matches[0]) : 0;

	return numberSuffix;
};

/**
 * @description Removes trailing numbers from the end of a string
 */
const removeNumberSuffix = (str: string): string => str.replace(/\d+$/, "");

/**
 * @description Sets a unique name on a stock-portfolio, if a stock-portfolio with the same name
 *     already exists
 */
export const setUniqueName = async (stockPortfolio: IStockPortfolio): Promise<void> => {
	const { constructor, isNew, name } = stockPortfolio;

	if (!isNew) {
		return;
	}

	const model = constructor as Model<IStockPortfolio>;

	const sameNameDoc = await model.findOne({ name });

	/* This name is unique. No need to generate a new name. */
	if (!sameNameDoc) {
		return;
	}

	const numberSuffix: number = getNumberSuffix(name) + 1;
	const baseStr: string = removeNumberSuffix(name);
	const updatedName = `${baseStr}${numberSuffix}`;

	stockPortfolio.name = updatedName;
};
