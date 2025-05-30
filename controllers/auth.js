const { StatusCodes } = require("http-status-codes");

const register = (req, res, next) => {
	return res.status(StatusCodes.OK).json({ data: "Register Success" });
};
const login = (req, res, next) => {
	return res.status(StatusCodes.OK).json({ data: "Login Successfully" });
};

module.exports = {
	register,
	login,
};
