import Winston from "winston";

export const Logger: Winston.Logger = Winston.createLogger({
	levels: Winston.config.syslog.levels,
	transports: [
		new Winston.transports.Console({ level: "info" }),
		new Winston.transports.Console({ level: "error" })
	]
});
