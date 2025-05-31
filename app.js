const connectDB = require("./db/connect");
const express = require("express");
require("dotenv").config();

// Routes
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// security packages
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// MW
const { errorMW, notFoundMW, authMW } = require("./Middleware");

// start express Server
const app = express();
const PORT = process.env.PORT || 3000;
//security Packages
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});
app.use(limiter);

// Static MW
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMW, jobRouter);

// CustomMW
app.use(notFoundMW);
app.use(errorMW);

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		console.log("Connected to DB");
		app.listen(PORT, () => {
			console.log("Server is listening at ", PORT);
		});
	} catch (error) {}
};

start();
