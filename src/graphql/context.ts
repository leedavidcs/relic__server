import { getAuthorizedUserId, IWithUser } from "@/authentication";
import { AbstractConnector, connectors } from "@/connectors";
import { getLoaders } from "@/dataloaders";
import { dataSources } from "@/datasources";
import { PrismaClient, User } from "@prisma/client";
import DataLoader from "dataloader";
import { ParameterizedContext } from "koa";

interface IContextConnectors {
	[key: string]: AbstractConnector;
}

interface IContextLoaders {
	[key: string]: DataLoader<any, any>;
}

interface IDeriveApolloContextInput {
	headers: Record<string, string>;
	koaCtx: ParameterizedContext<IWithUser> | null;
	prisma: PrismaClient;
}

export interface IServerContext<
	C extends IContextConnectors = typeof connectors,
	L extends IContextLoaders = ReturnType<typeof getLoaders>
> {
	connectors: C;
	dataSources: ReturnType<typeof dataSources>;
	headers: { [key: string]: string };
	loaders: L;
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
	const loaders = getLoaders();
	const userId: string | null = koaCtx ? getAuthorizedUserId(koaCtx) : null;

	const user: User | null = userId ? await prisma.user.findOne({ where: { id: userId } }) : null;

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		connectors,
		headers,
		loaders,
		koaCtx,
		prisma,
		user
	};

	return apolloContext;
};
