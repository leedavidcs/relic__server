import { IWithUser } from "@/authentication";
import { AbstractConnector, connectors } from "@/connectors";
import { getLoaders } from "@/dataloaders";
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
	headers: { [key: string]: string };
	koaCtx: ParameterizedContext<IWithUser> | null;
	loaders: L;
}

export const deriveApolloContext = (
	headers: { [key: string]: string } = {},
	koaCtx: ParameterizedContext<IWithUser> | null,
	props?: { [key: string]: any }
) => {
	const apolloContext: IServerContext = {
		connectors,
		headers,
		koaCtx,
		loaders: getLoaders(),
		...props
	};

	return apolloContext;
};
