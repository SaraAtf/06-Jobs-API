const { StatusCodes } = require("http-status-codes");

const getAllJobs = (req, res, next) => {
	console.log("Test");
	return res.status(StatusCodes.OK).json({ data: "Get All Jobs" });
};
const getJobById = (req, res, next) => {
	console.log("2");
	return res.status(StatusCodes.OK).json({ data: "Get Job by id" });
};
const createJob = (req, res, next) => {
	return res.status(StatusCodes.OK).json({ data: "Create New Job" });
};
const editJob = (req, res, next) => {
	console.log("Edit");
	return res.status(StatusCodes.OK).json({ data: `Edit Job ${req.params.id}` });
};
const deleteJob = (req, res, next) => {
	return res
		.status(StatusCodes.OK)
		.json({ data: `Delete Job with id ${req.params.id}` });
};

module.exports = {
	getAllJobs,
	getJobById,
	createJob,
	editJob,
	deleteJob,
};
