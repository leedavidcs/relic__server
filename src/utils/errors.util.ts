import { ApolloError } from "apollo-server-koa";

export class OperationUnavailableError extends ApolloError {
	constructor(message: string = "This operation is unavailable.") {
		super(message, "NOT_IMPLEMENTED");
	}
}

export class AuthorizationError extends ApolloError {
	constructor(message: string = "This operation is not authorized.") {
		super(message, "UNAUTHORIZED");
	}
}

export class ComplexityError extends ApolloError {
	constructor(message: string = "This operation is exceeds max complexity constraints.") {
		super(message, "FORBIDDEN");
	}
}

export class NotFoundError extends ApolloError {
	constructor(message: string = "This entity could not be found.") {
		super(message, "Not_FOUND");
	}
}
