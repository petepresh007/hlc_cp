const errorHandler = (err, req, res, next) => {
    // customError object
    const customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || "Internal server error occurred"
    };

    // Validation error
    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = 400;
    }

    // Duplicate key error
    if (err.code && err.code === 11000) {
        customError.msg = `${Object.keys(err.keyValue)} already exists, please enter another ${Object.keys(err.keyValue)}`;
        customError.statusCode = 400;
    }

    // Cast error
    if (err.name === "CastError") {
        customError.msg = `No item found with id: ${err.value}`;
        customError.statusCode = 404;
    }

    res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandler;