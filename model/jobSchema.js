const mongoose = require("mongoose");

let jobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, "Please Provide Company Name"],
			maxlength: 50,
		},
		position: {
			type: String,
			required: [true, "Please Provide Position Name"],
			maxlength: 100,
		},
		jobType: {
			type: String,
			enum: ["full-time", "part-time", "remote", "internship"],
			default: "full-time",
		},
		jobLocation: {
			type: String,
			require: [true, "Provide a job location"],
			default: "my City",
		},
		status: {
			type: String,
			enum: ["interview", "pending", "declined"],
			default: "pending",
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please Provide user"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
