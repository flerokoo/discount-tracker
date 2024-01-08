"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.InternalError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.ApplicationError = exports.HTTP_SERVICE_UNAVAILABLE = exports.HTTP_INTERNAL_SERVER_ERROR = exports.HTTP_TOO_MANY_REQUESTS = exports.HTTP_NOT_FOUND = exports.HTTP_CONFLICT = exports.HTTP_FORBIDDEN = exports.HTTP_UNAUTHORIZED = exports.HTTP_BAD_REQUEST = exports.HTTP_OK = void 0;
exports.HTTP_OK = 200;
exports.HTTP_BAD_REQUEST = 400;
exports.HTTP_UNAUTHORIZED = 401;
exports.HTTP_FORBIDDEN = 403;
exports.HTTP_CONFLICT = 409;
exports.HTTP_NOT_FOUND = 404;
exports.HTTP_TOO_MANY_REQUESTS = 429;
exports.HTTP_INTERNAL_SERVER_ERROR = 500;
exports.HTTP_SERVICE_UNAVAILABLE = 503;
class ApplicationError extends Error {
    status;
    payload;
    constructor(message, payload) {
        super(message);
        this.status = exports.HTTP_NOT_FOUND;
        this.payload = payload;
    }
}
exports.ApplicationError = ApplicationError;
function createErrorClass(httpStatus) {
    return class extends ApplicationError {
        constructor(message, payload) {
            super(message, payload);
            this.status = httpStatus;
        }
    };
}
exports.ValidationError = createErrorClass(exports.HTTP_BAD_REQUEST);
exports.AuthenticationError = createErrorClass(exports.HTTP_FORBIDDEN);
exports.AuthorizationError = createErrorClass(exports.HTTP_UNAUTHORIZED);
exports.NotFoundError = createErrorClass(exports.HTTP_NOT_FOUND);
exports.ConflictError = createErrorClass(exports.HTTP_CONFLICT);
exports.InternalError = createErrorClass(exports.HTTP_INTERNAL_SERVER_ERROR);
exports.ServiceUnavailableError = createErrorClass(exports.HTTP_SERVICE_UNAVAILABLE);
