import { applyAuthentication, IWithUser } from "@/authentication";
import { getApolloServer } from "@/graphql";
import { closeDatabase, connectToDatabase } from "@/mongodb";
import { ApolloServer } from "apollo-server-koa";
import Http, { RequestListener } from "http";
import Koa, { ParameterizedContext } from "koa";
import { applyMiddlewares } from "./middlewares";
import { applyRoutes } from "./routes";

const DEFAULT_PORT: number = 8080;
const MAX_GRAPHQL_COMPLEXITY: number = 500;
const MAX_GRAPHQL_DEPTH: number = 10;

const applyGraphQL = (server: Server): void => {
	const apolloServer: ApolloServer = getApolloServer<
		ApolloServer,
		{ ctx: ParameterizedContext<IWithUser> }
	>(ApolloServer, {
		getHeaders: ({ ctx: { header } }) => header,
		getKoaCtx: ({ ctx }) => ctx,
		maxComplexity: MAX_GRAPHQL_COMPLEXITY,
		maxDepth: MAX_GRAPHQL_DEPTH
	});

	apolloServer.applyMiddleware({ app: server.app });
};

export class Server {
	public app: Koa;
	public httpServer: Http.Server;

	constructor(public port: number = DEFAULT_PORT) {
		this.app = new Koa();

		const requestListener: RequestListener = this.app.callback();

		this.httpServer = new Http.Server(requestListener);
	}

	public run(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.isRunning
				? resolve()
				: this.configure()
						.then(() => this.httpServer.listen(this.port, resolve))
						.catch(reject);
		});
	}

	public stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			!this.isRunning
				? resolve()
				: this.prepareStop()
						.then(() => this.httpServer.close((err) => (err ? reject(err) : resolve())))
						.catch(reject);
		});
	}

	public get isRunning(): boolean {
		return this.httpServer.listening;
	}

	public async configure(): Promise<void> {
		await connectToDatabase();

		applyAuthentication(this);
		applyMiddlewares(this);
		applyGraphQL(this);
		applyRoutes(this);
	}

	public async prepareStop(): Promise<void> {
		await closeDatabase();
	}
}
