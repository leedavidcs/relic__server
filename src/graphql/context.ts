import { IWithUser } from "@/authentication";
import { AbstractConnector, connectors } from "@/connectors";
import { getLoaders } from "@/dataloaders";
import { dataSources } from "@/datasources";
import DataLoader from "dataloader";
import { ParameterizedContext } from "koa";

interface IContextConnectors {
	[key: string]: AbstractConnector;
}

interface IContextLoaders {
	[key: string]: DataLoader<string, any>;
}

export interface IServerContext<
	C extends IContextConnectors = typeof connectors,
	L extends IContextLoaders = ReturnType<typeof getLoaders>
> {
	connectors: C;
	dataSources: ReturnType<typeof dataSources>;
	headers: { [key: string]: string };
	koaCtx: ParameterizedContext<IWithUser> | null;
	loaders: L;
}

export const deriveApolloContext = (
	headers: { [key: string]: string } = {},
	koaCtx: ParameterizedContext<IWithUser> | null,
	props?: { [key: string]: any }
) => {
	const apolloContext: Omit<IServerContext, "dataSources"> = {
		connectors,
		headers,
		koaCtx,
		loaders: getLoaders(),
		...props
	};

	return apolloContext;
};
