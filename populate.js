require("dotenv").config();
const JobSchema = require("./model/jobSchema");
const connectDB = require("./db/connect");
const mockData = require("./mock-data.json");

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		await JobSchema.create(mockData);
		console.log("success");
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

start();
