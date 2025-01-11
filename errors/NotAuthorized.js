const CustomApiError = require("./CustomApiError");

class NotAuthorizedError extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode = 401
    }
}

module.exports = NotAuthorizedError;