import { config } from "dotenv";
import path from "path";

config({
	path: path.resolve(__dirname, `./.env.${process.env.NODE_ENV || "development"}`)
});

/* eslint-disable import/first */
import { Server } from "./src/server";
import { Logger } from "./src/utils";

const PORT = 3031;

const server: Server = new Server(PORT);

server.run().then(() => Logger.info(`Server is running on port: ${PORT}`));
