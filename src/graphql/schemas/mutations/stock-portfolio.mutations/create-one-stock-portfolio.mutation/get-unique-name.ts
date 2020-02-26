import { IServerContextWithUser } from "@/graphql/context";
import { StockPortfolio } from "@prisma/client";

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
	newName: string,
	context: IServerContextWithUser
): Promise<string> => {
	const { prisma, user } = context;

	const stockPortfolios: readonly StockPortfolio[] = await prisma.stockPortfolio.findMany({
		where: {
			user: { id: user.id },
			name: { startsWith: newName }
		}
	});

	const withSameName: Maybe<StockPortfolio> = stockPortfolios.find(({ name }) => {
		return name === newName;
	});

	if (!withSameName) {
		return newName;
	}

	const withNumberSuffix: readonly StockPortfolio[] = stockPortfolios.filter(({ name }) => {
		return new RegExp(`^${newName}\\d*$`).test(name);
	});

	const baseStr: string = removeNumberSuffix(newName);
	const lowestUniqSuffixForName: number = withNumberSuffix
		.slice()
		.map(({ name }) => getNumberSuffix(name))
		.sort((a, b) => a - b)
		.reduce((nextSuffix, suffix) => (nextSuffix === suffix ? suffix + 1 : nextSuffix), 1);
	const uniqueName = `${baseStr}${lowestUniqSuffixForName}`;

	return uniqueName;
};
