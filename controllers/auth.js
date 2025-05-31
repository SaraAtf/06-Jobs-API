const { StatusCodes } = require("http-status-codes");

const userSchema = require("../model/authSchema");
const { BadRequest } = require("../errors");
const Unauthonticated = require("../errors/unauthonticated");
const register = async (req, res, next) => {
	const user = await userSchema.create({ ...req.body });
	const token = user.createJWT();
	return res.status(StatusCodes.CREATED).json({ token });
};
const login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequest("Please Provide an email or password");
	}

	const user = await userSchema.findOne({ email });
	if (!user) {
		throw new Unauthonticated("Invalid credentials");
	}
	// compare Password == password  with user.password
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new Unauthonticated("Invalid credentials");
	}
	const token = user.createJWT();
	return res.status(StatusCodes.OK).json({ user: user.name, token });
};

module.exports = {
	register,
	login,
};
