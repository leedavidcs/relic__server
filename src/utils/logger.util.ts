import Winston, { createLogger, transports } from "winston";

export const Logger: Winston.Logger = createLogger({
	transports: [new transports.Console()]
});
