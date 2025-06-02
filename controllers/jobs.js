const { StatusCodes } = require("http-status-codes");
const JobSchema = require("../model/jobSchema");

const { NotFound, BadRequest } = require("../errors");
const mongoose = require("mongoose");
const moment = require("moment");

const createJob = async (req, res, next) => {
	req.body.createdBy = req.user.userId;
	console.log(req.body);
	const job = await JobSchema.create(req.body);
	return res.status(StatusCodes.CREATED).json({ job });
};
const getAllJobs = async (req, res, next) => {
	const { search, status, jobType, sort } = req.query;

	const queryObject = {
		createdBy: req.user.userId,
	};
	if (search) {
		queryObject.position = { $regex: search, $options: "i" };
	}
	if (status && status !== "all") {
		queryObject.status = status;
	}
	if (jobType && jobType !== "all") {
		queryObject.jobType = jobType;
	}
	let result = JobSchema.find(queryObject);

	if (sort == "latest") {
		result.sort("createdAt");
	}
	if (sort == "oldest") {
		result.sort("-createdAt");
	}
	if (sort == "a-z") {
		result.sort("position");
	}
	if (sort == "z-a") {
		result.sort("-position");
	}

	const page = Number(req.page) || 1;
	const limit = Number(req.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);
	let jobs = await result;
	const totalJobs = await JobSchema.countDocuments(queryObject);
	const numberOfPages = Math.ceil(totalJobs / limit);

	return res
		.status(StatusCodes.OK)
		.json({ jobs, count: jobs.length, totalJobs, numberOfPages });
};
const getJobById = async (req, res, next) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await JobSchema.findOne({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) {
		throw new NotFound(`No Job With ${jobId}`);
	}
	return res.status(StatusCodes.OK).json({ job });
};
const editJob = async (req, res, next) => {
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req;
	if (company == " " || position == " ") {
		throw new BadRequest("Company Or position can not be empty");
	}

	const job = await JobSchema.findByIdAndUpdate(
		{
			_id: jobId,
			createdBy: userId,
		},
		req.body,
		{ new: true, runValidators: true }
	);
	if (!job) {
		throw new NotFound("No Job With this id");
	}
	return res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res, next) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await JobSchema.findByIdAndDelete({
		_id: jobId,
		createdBy: userId,
	});

	if (!job) {
		throw new NotFound("No Job With this id");
	}

	return res
		.status(StatusCodes.OK)
		.json({ msg: `Delete Job with id ${req.params.id}` });
};

const showStats = async (req, res, next) => {
	let stats = await JobSchema.aggregate([
		{
			$match: {
				createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId),
			},
		},
		{ $group: { _id: "$status", count: { $sum: 1 } } },
	]);
	stats = stats.reduce((acc, curr) => {
		let { _id: title, count } = curr;
		acc[title] = count;
		return acc;
	}, {});

	let monthlyApplications = await JobSchema.aggregate([
		{
			$match: {
				createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId),
			},
		},
		{
			$group: {
				_id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
				count: { $sum: 1 },
			},
		},
		{ $sort: { "_id.year": 1, "_id.month": 1 } },
	]);

	monthlyApplications = monthlyApplications.map((item) => {
		const {
			_id: { year, month },
			count,
		} = item;
		const date = moment()
			.month(month - 1)
			.year(year)
			.format("MMM Y");

		return { date, count };
	});

	const defaultStats = {
		pending: stats.pending || 0,
		interview: stats.interview || 0,
		declined: stats.declined || 0,
	};

	return res.status(StatusCodes.OK).json({
		defaultStats,
		monthlyApplications,
	});
};
module.exports = {
	getAllJobs,
	getJobById,
	createJob,
	editJob,
	deleteJob,
	showStats,
};
