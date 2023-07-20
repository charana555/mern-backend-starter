import { StatusCodes } from "http-status-codes";

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

class UnAuthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
  ForbiddenError,
  ConflictError,
};
