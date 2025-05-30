const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please Provide a Name"],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, "Please Provide an Email"],
		match: [],
	},
});
