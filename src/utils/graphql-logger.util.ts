import { createLogger, format, Logger, transports } from "winston";

const { combine, metadata, printf, timestamp } = format;

export const GraphQLLogger: Logger = createLogger({
	transports: [
		new transports.Console({
			format: combine(
				metadata({ key: "metadata" }),
				timestamp(),
				printf(({ message, metadata: { ...meta } }) =>
					[
						`message: ${message}`,
						...Object.keys(meta).map((key) => `${key}:\n${meta[key]}`)
					]
						.join("\n\n")
						.concat("\n\n")
				)
			)
		})
	]
});
