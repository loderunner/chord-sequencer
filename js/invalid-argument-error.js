function InvalidArgumentError(message) {
    this.message = message;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = (new Error()).stack;
    }
    return this;
};

Object.setPrototypeOf(InvalidArgumentError, Error);
InvalidArgumentError.prototype = Object.create(Error.prototype);
InvalidArgumentError.prototype.name = "InvalidArgumentError";
InvalidArgumentError.prototype.constructor = InvalidArgumentError;

module.exports = InvalidArgumentError;