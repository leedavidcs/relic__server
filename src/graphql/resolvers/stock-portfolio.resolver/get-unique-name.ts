import { IAbstractSource } from "@/connectors";
import { IStockPortfolio } from "@/mongodb";

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
	const sameNameDoc: IStockPortfolio | null = await source.findOne({ name });

	if (!sameNameDoc) {
		return name;
	}

	const numberSuffix: number = getNumberSuffix(name) + 1;
	const baseStr: string = removeNumberSuffix(name);
	const updatedName = `${baseStr}${numberSuffix}`;

	return updatedName;
};
