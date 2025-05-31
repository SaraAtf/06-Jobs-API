const errorMW = require("./error-handler");
const notFoundMW = require("./notFound");
const authMW = require("./auth");

module.exports = {
	errorMW,
	notFoundMW,
	authMW,
};
