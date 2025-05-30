const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("./custom-error");

class BadRequest extends CustomErrorAPI {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

module.exports = BadRequest;
