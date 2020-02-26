import { getAuthorizedUserId, IWithUser } from "@/authentication";
import { dataSources } from "@/datasources";
import { PrismaClient, User } from "@prisma/client";
import { ParameterizedContext } from "koa";

interface IDeriveApolloContextInput {
	headers: Record<string, string>;
	koaCtx: ParameterizedContext<IWithUser> | null;
	prisma: PrismaClient;
}

export interface IServerContext {
	dataSources: ReturnType<typeof dataSources>;
	headers: { [key: string]: string };
	koaCtx: ParameterizedContext<IWithUser> | null;
	prisma: PrismaClient;
	user: User | null;
}

// Context with non-nullable user, for resolvers that are guarded by authentication permissions
export type IServerContextWithUser = Omit<IServerContext, "user"> & {
	user: NonNullable<IServerContext["user"]>;
};

export const deriveApolloContext = async ({
	headers,
	koaCtx,
	prisma
}: IDeriveApolloContextInput) => {
	const userId: string | null = koaCtx ? getAuthorizedUserId(koaCtx) : null;

	const user: User | null = userId ? await prisma.user.findOne({ where: { id: userId } }) : null;

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		headers,
		koaCtx,
		prisma,
		user
	};

	return apolloContext;
};
