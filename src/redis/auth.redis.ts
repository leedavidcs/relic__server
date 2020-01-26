import Redis, { RedisClient } from "redis";

const host: string = process.env.REDIS_AUTH_HOST || "";
const port = Number(process.env.REDIS_AUTH_PORT);

export const AuthClient: RedisClient = Redis.createClient({
	host,
	port
});

export const saveRefreshToken = (refreshToken: string, userId: string): Promise<number> => {
	return new Promise<number>((resolve, reject) => {
		AuthClient.hset(refreshToken, "userId", userId, (err, reply) => {
			err ? reject(err) : resolve(reply);
		});
	});
};

export const getRefreshTokenUserId = (refreshToken: string): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		AuthClient.hget(refreshToken, "userId", (err, userId) => {
			err ? reject(err) : resolve(userId);
		});
	});
};
