import { Logger } from "@/utils";
import { MongoMemoryServer } from "mongodb-memory-server";
import Mongoose from "mongoose";
import { StockPortfolioModel, UserModel } from "./models";

export * from "./models";

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const dbName = process.env.MONGODB_DBNAME;
const pass = process.env.MONGODB_PASS;
const user = process.env.MONGODB_USER;

const getRealConnectionUri = (): string => {
	/* tslint:disable:no-if-statement */
	if (!host || !port || !dbName) {
		throw new Error("Could not connect to database. Check environment variables");
	}
	/* tslint:enable:no-if-statement */

	const authPartial: string = pass && user ? `${user}:${pass}@` : "";
	const uri = `mongodb://${authPartial}${host}:${port}/${dbName}`;

	return uri;
};

const getMockConnectionUri = async (): Promise<string> => {
	const mongoServer: MongoMemoryServer = new MongoMemoryServer();

	const uri: string = await mongoServer.getConnectionString();

	return uri;
};

const getConnectionUri = async (): Promise<string> => {
	const connectionUri: string =
		process.env.NODE_ENV === "testing" ? await getMockConnectionUri() : getRealConnectionUri();

	return connectionUri;
};

export const connectToDatabase = async (): Promise<Mongoose.Mongoose> => {
	try {
		const connectionUri: string = await getConnectionUri();

		await Mongoose.connect(connectionUri, {
			useNewUrlParser: true
		});

		Logger.info(`Connected to MongoDB: ${dbName}`);
	} catch (err) {
		throw new Error(`Could not connect to database. Error: ${err}`);
	}

	return Mongoose;
};

export const closeDatabase = async (): Promise<void> => {
	await Mongoose.disconnect();

	Logger.info(`Closed connection to MongoDB: ${dbName}`);
};

// Add models here
export const models = {
	StockPortfolio: StockPortfolioModel,
	User: UserModel
};
