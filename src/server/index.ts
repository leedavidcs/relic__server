import { applyAuthentication } from "@/authentication";
import { buildEmailTemplates } from "@/emails";
import { getApolloServer } from "@/graphql";
import { getPrismaClient } from "@/prisma";
import { Logger } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-koa";
import Http, { RequestListener } from "http";
import Koa from "koa";
import { applyMiddlewares } from "./middlewares";
import { applyRoutes } from "./routes";

const DEFAULT_PORT = 8080;
const MAX_GRAPHQL_COMPLEXITY = 500;
const MAX_GRAPHQL_DEPTH = 10;

const applyGraphQL = (server: Server): void => {
	const { app, prisma } = server;

	const apolloServer: ApolloServer = getApolloServer(ApolloServer, {
		getHeaders: ({ ctx: { header } }) => header,
		getKoaCtx: ({ ctx }) => ctx,
		maxComplexity: MAX_GRAPHQL_COMPLEXITY,
		maxDepth: MAX_GRAPHQL_DEPTH,
		prisma
	});

	apolloServer.applyMiddleware({ app });
};

export class Server {
	public app: Koa;
	public httpServer: Http.Server;
	public prisma: PrismaClient;

	constructor(public port: number = DEFAULT_PORT) {
		this.app = new Koa();

		const requestListener: RequestListener = this.app.callback();
		this.httpServer = new Http.Server(requestListener);

		this.prisma = getPrismaClient();
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
		buildEmailTemplates();

		await this.prisma.connect().then(() => Logger.info("Connected to Prisma"));

		applyAuthentication(this);
		applyMiddlewares(this);
		applyGraphQL(this);
		applyRoutes(this);
	}

	public async prepareStop(): Promise<void> {
		await this.prisma.disconnect().then(() => Logger.info("Disconnected from Prisma"));
	}
}
