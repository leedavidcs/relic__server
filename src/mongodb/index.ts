import { Logger } from "@/utils";
import Mongoose from "mongoose";
import { UserModel } from "./models";

export * from "./models";

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const dbName = process.env.MONGODB_DBNAME;
const pass = process.env.MONGODB_PASS;
const user = process.env.MONGODB_USER;

interface IMongoDBConnectionParams {
	host: string;
	port: string;
	dbName: string;
	pass?: string;
	user?: string;
}

const buildConnectionUri = (params: IMongoDBConnectionParams): string => {
	const authPartial: string = params.pass && params.user ? `${user}:${pass}@` : "";
	const uri: string = `mongodb://${authPartial}${host}:${port}/${dbName}`;

	return uri;
};

export const connectToDatabase = async (): Promise<Mongoose.Mongoose> => {
	/* tslint:disable:no-if-statement */
	if (!host || !port || !dbName) {
		throw new Error("Could not connect to database. Check environment variables");
	}
	/* tslint:enable:no-if-statement */

	try {
		const connectionUri: string = buildConnectionUri({ host, port, dbName, user, pass });

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
	UserModel
};
