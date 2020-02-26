export const getBaseUrl = (): string => {
	const baseUrl: string = process.env.NODE_ENV !== "production" ? "http://localhost:3031" : "";

	return baseUrl;
};
