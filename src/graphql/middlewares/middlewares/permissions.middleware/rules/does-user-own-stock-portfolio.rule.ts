import { IServerContextWithUser } from "@/graphql/context";
import { User } from "@prisma/client";
import { rule } from "graphql-shield";

export const doesUserOwnStockPortfolio = rule({
	cache: "contextual"
})(async (parent, args: { data: { id: string } }, { prisma, user }: IServerContextWithUser) => {
	const owner: Maybe<User> = await prisma.stockPortfolio
		.findOne({ where: { id: args.data.id } })
		.user();

	const isUserTheOwner: boolean = owner?.id === user.id;

	return isUserTheOwner;
});
