const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please Provide a Name"],
		minlength: 3,
		maxlength: 50,
	},
	lastName: {
		type: String,
		trim: true,
		maxlength: 30,
		default: "lastName",
	},
	location: {
		type: String,
		trim: true,
		maxlength: 30,
		default: "my City",
	},
	email: {
		type: String,
		required: [true, "Please Provide an Email"],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			,
			"Please Provide  valid Email",
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Provide a password"],
		minlength: 6,
	},
});

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userId: this._id, name: this.name },
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: "30d",
		}
	);
};

userSchema.methods.comparePassword = async function (userPassword) {
	return bcrypt.compare(userPassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
