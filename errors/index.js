const NotFound = require("./not-found");
const BadRequest = require("./bad-request");
const UnAuthorized = require("./unauthorized");
const CustomErrorAPI = require("./custom-error");

module.exports = {
	BadRequest,
	CustomErrorAPI,
	NotFound,
	UnAuthorized,
};
