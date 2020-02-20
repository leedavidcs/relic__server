import { getAuthorizedUser, IWithUser } from "@/authentication";
import { AbstractConnector, connectors } from "@/connectors";
import { getLoaders } from "@/dataloaders";
import { dataSources } from "@/datasources";
import { IUser } from "@/mongodb";
import DataLoader from "dataloader";
import { ParameterizedContext } from "koa";

interface IContextConnectors {
	[key: string]: AbstractConnector;
}

interface IContextLoaders {
	[key: string]: DataLoader<any, any>;
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
	user: IUser | null;
}

// Context with non-nullable user, for resolvers that are guarded by authentication permissions
export type IServerContextWithUser = Omit<IServerContext, "user"> & {
	user: NonNullable<IServerContext["user"]>;
};

export const deriveApolloContext = async (
	headers: { [key: string]: string } = {},
	koaCtx: ParameterizedContext<IWithUser> | null
) => {
	const loaders = getLoaders();
	const user: IUser | null = koaCtx ? await getAuthorizedUser(koaCtx) : null;

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		connectors,
		headers,
		loaders,
		koaCtx,
		user
	};

	return apolloContext;
};
