import { PrismaClient } from "@prisma/client";

const isDebug: boolean = process.env.NODE_ENV !== "productionn";

export const getPrismaClient = (): PrismaClient => {
	const prisma = new PrismaClient({
		debug: isDebug,
		log: isDebug ? ["info", "query", "warn"] : []
	});

	return prisma;
};
