import { MongoDBConnector } from "./mongodb.connector";

export * from "./abstract.connector";
export * from "./mongodb.connector";

export const connectors = {
	MongoDB: new MongoDBConnector()
};
