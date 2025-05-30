const express = require("express");
const {
	getAllJobs,
	createJob,
	getJobById,
	deleteJob,
	editJob,
} = require("../controllers/jobs");

const router = express.Router();

router.route("/").get(getAllJobs).post(createJob);

router.route("/:id").get(getJobById).delete(deleteJob).patch(editJob);

module.exports = router;
