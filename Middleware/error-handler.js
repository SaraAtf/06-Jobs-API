const { StatusCodes } = require("http-status-codes");

const errorMW = (err, req, res, next) => {
	console.log("Erorrr ", err);
	const customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "something went wrong try again later",
	};
	if (err.name == "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(" , ");
		customError.statusCode = 400;
	}
	if ((err.name = "CastError")) {
		customError.statusCode = 404;
		customError.msg = `No item found with ${err.value}`;
	}
	if (err.code && err.code === 11000) {
		customError.statusCode = 400;
		customError.msg = `duplicated ${Object.keys(
			err.keyValue
		)} please enter anther ${Object.keys(err.keyValue)}`;
	}
	return res.status(customError.statusCode).json({ msg: customError.msg });
	//return res.status(customError.statusCode).json({ err });
};

module.exports = errorMW;
