
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./database/db.js";
import router from "./router/userrouter.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/user", router);

const startServer = async () => {
  try {
    // Connect to MongoDB before accepting requests
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
