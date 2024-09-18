'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
};

const reasonStatusCode = {
    FORBIDDEN: "Forbidden Error",
    CONFLICT: "Conflict Error"
};

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// 409
class ConflictErrorResponse extends ErrorResponse {
    constructor(message = reasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

// 403
class BadRequestErrorResponse extends ErrorResponse {
    constructor(message = reasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

module.exports = { ConflictErrorResponse, BadRequestErrorResponse }