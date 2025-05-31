const { UnAuthorized, CustomErrorAPI } = require("../errors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMW = (req, res, next) => {
	const token = req.headers.authorization;

	if (!token || !token.startsWith("Bearer ")) {
		throw new UnAuthorized("Invalid Token ");
	}

	const jwtToken = token.split(" ")[1];
	try {
		const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
		req.user = decoded;
	} catch (error) {
		throw new UnAuthorized("Provide a valid Token");
	}

	next();
};

module.exports = authMW;
