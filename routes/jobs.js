const express = require("express");
const {
	getAllJobs,
	createJob,
	getJobById,
	deleteJob,
	editJob,
	showStats,
} = require("../controllers/jobs");

const router = express.Router();

router.route("/").get(getAllJobs).post(createJob);
router.route("/showStats").get(showStats);

router.route("/:id").get(getJobById).delete(deleteJob).patch(editJob);

module.exports = router;
