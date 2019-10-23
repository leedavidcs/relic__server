export class OperationUnavailableError extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export class AuthorizationError extends Error {
	constructor(message?: string) {
		super(message);
	}
}
