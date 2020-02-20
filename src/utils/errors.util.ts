import { ApolloError } from "apollo-server-koa";

export class AuthorizationError extends ApolloError {
	constructor(message = "This operation is not authorized.") {
		super(message, "UNAUTHORIZED");
	}
}

export class ComplexityError extends ApolloError {
	constructor(message = "This operation is exceeds max complexity constraints.") {
		super(message, "FORBIDDEN");
	}
}

export class NotFoundError extends ApolloError {
	constructor(message = "This entity could not be found.") {
		super(message, "NOT_FOUND");
	}
}

export class OperationUnavailableError extends ApolloError {
	constructor(message = "This operation is unavailable.") {
		super(message, "NOT_IMPLEMENTED");
	}
}

export class UnexpectedError extends ApolloError {
	constructor(message = "Unexpected Error. Should not reach here.") {
		super(message, "UNEXPECTED");
	}
}
