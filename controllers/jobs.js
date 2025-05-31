const { StatusCodes } = require("http-status-codes");
const JobSchema = require("../model/jobSchema");

const { NotFound, BadRequest } = require("../errors");

const createJob = async (req, res, next) => {
	req.body.createdBy = req.user.userId;
	const job = await JobSchema.create(req.body);
	return res.status(StatusCodes.CREATED).json({ job });
};
const getAllJobs = async (req, res, next) => {
	const jobs = await JobSchema.find({ createdBy: req.user.userId }).sort(
		"createdAt"
	);
	return res.status(StatusCodes.OK).json({ jobs });
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

module.exports = {
	getAllJobs,
	getJobById,
	createJob,
	editJob,
	deleteJob,
};
