import { IAbstractSource } from "@/connectors";
import { IStockPortfolio } from "@/mongodb";
import { isEmpty } from "lodash";

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
 * @description Returns a unique stock portfolio name, based on the name supplied. If the name is
 *     already unique, it will be returned. Otherwise, this name will increment the name.
 */
export const getUniqueName = async (
	name: string,
	source: IAbstractSource<IStockPortfolio>
): Promise<string> => {
	const stockPortfolios: readonly IStockPortfolio[] = await source.find({
		name: new RegExp(`^${name}\\d*$`)
	});

	if (isEmpty(stockPortfolios)) {
		return name;
	}

	const baseStr: string = removeNumberSuffix(name);
	const lowestUniqSuffixForName: number = stockPortfolios
		.slice()
		.map((stockPortfolio) => getNumberSuffix(stockPortfolio.name))
		.sort((a, b) => a - b)
		.reduce((nextSuffix, suffix) => (nextSuffix === suffix ? suffix + 1 : nextSuffix), 1);
	const updatedName = `${baseStr}${lowestUniqSuffixForName}`;

	return updatedName;
};
