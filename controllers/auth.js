const { StatusCodes } = require("http-status-codes");

const userSchema = require("../model/authSchema");
const { BadRequest, NotFound } = require("../errors");
const Unauthonticated = require("../errors/unauthonticated");
const register = async (req, res, next) => {
	const user = await userSchema.create({ ...req.body });
	const token = user.createJWT();
	return res.status(StatusCodes.CREATED).json({ user, token });
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
	return res.status(StatusCodes.OK).json({ user: user, token });
};

const updateUser = async (req, res, next) => {
	const {
		user: { userId },
		body: { name, email, location, lastName },
	} = req;
	console.log(req.user);

	// if (!name || !email || !location || !lastName) {
	// 	throw new BadRequest("Provide All Values");
	// }

	const user = await userSchema.findByIdAndUpdate({ _id: userId }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		throw new NotFound("This user is Not Found");
	}
	const token = user.createJWT();

	return res.status(200).json({ user, token });
};
module.exports = {
	register,
	login,
	updateUser,
};
