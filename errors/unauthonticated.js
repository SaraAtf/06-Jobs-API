const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("./custom-error");

class Unauthonticated extends CustomErrorAPI {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NETWORK_AUTHENTICATION_REQUIRED;
	}
}

module.exports = Unauthonticated;
