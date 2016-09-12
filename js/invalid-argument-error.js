function InvalidArgumentError(message) {
    this.message = message;

    return this;
};

Object.setPrototypeOf(InvalidArgumentError, Error);
InvalidArgumentError.prototype = Object.create(Error.prototype);
InvalidArgumentError.prototype.name = "InvalidArgumentError";
InvalidArgumentError.prototype.constructor = InvalidArgumentError;

module.exports = InvalidArgumentError;