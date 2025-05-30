const { StatusCodes } = require("http-status-codes");

const notFoundMW = (req, res, next) => {
	res.status(StatusCodes.NOT_FOUND).json({ msg: "Route Doesn't Exist" });
};

module.exports = notFoundMW;
