const connectDB = require("./db/connect");
const express = require("express");
require("dotenv").config();
const path = require("path");

// Routes
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// MW
const { errorMW, notFoundMW, authMW } = require("./Middleware");

// start express Server
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React build directory
app.use(express.static(path.resolve(__dirname, "./client/build")));

// Static MW
app.use(express.json());

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMW, jobRouter);

// Handle React routing, return all requests to React app

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
	} catch (error) {
		console.log(error);
	}
};

start();
