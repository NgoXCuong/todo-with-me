import express from "express";
import dotenv from "dotenv";
import taskRoute from "./routes/tasksRouters.js";
import connectionDB from "./config/db.js"; // 👉 import file kết nối
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Kết nối MongoDB trước khi khởi động server
connectionDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.use(express.json()); // nếu bạn cần parse body JSON
    app.use(cors({ origin: "http://localhost:5173" }));
    app.use("/api/tasks", taskRoute);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
