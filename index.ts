import { Server } from "./src/server";
import { Logger } from "./src/utils";

const PORT = 3031;

const server: Server = new Server(PORT);

server.run().then(() => Logger.info(`Server is running on port: ${PORT}`));
