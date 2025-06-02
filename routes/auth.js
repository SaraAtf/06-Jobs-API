const express = require("express");
const { register, login, updateUser } = require("../controllers/auth");
const authMW = require("../Middleware/auth");
const router = express.Router();

const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
router.route("/register").post(limiter, register);
router.route("/login").post(limiter, login);
router.route("/updateUser").patch(authMW, updateUser);

module.exports = router;
