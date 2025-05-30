require("dotenv").config();

const connectDB = require("./db/connect");
const express = require("express");
// Routes
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// MW
const { errorMW, notFoundMW } = require("./Middleware");

// start express Server
const app = express();
const PORT = process.env.PORT || 3000;

// Static MW
app.use(express.json());
// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobRouter);

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
