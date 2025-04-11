const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/authRoutes");

const kosRoutes = require("./routes/kosRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/kos", kosRoutes);
app.use("/api/auth", authRouter);

const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};
// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, clientOptions)
  .then(() => {
    console.log("MongoDB Connected");

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
