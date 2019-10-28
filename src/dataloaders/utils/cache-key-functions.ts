import objectHash from "object-hash";

export const objectCacheKeyFn = (key: { [key: string]: any }) => {
	const hash: string = objectHash(key, {
		unorderedObjects: true
	});

	return hash;
};
