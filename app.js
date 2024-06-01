require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const {
  AuthMiddleware,
  isAdmin,
} = require("./src/middlewares/auth.middleware");
const {
  checkQueueReadiness,
} = require("./src/libraries/queues/check-queue-readiness");
const {
  CONTENT_MODERATION_QUEUE,
} = require("./src/libraries/queues/content-moderation.queue");

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// middlewares

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://campusconnect.gbpuat.tech", "*"],
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.json());
// routes

app.get("/api/v1/healthcheck", (req, res) => {
  res.send("CAMPUSCONNECT BACKEND SERVICE  IS HEALTHY ✅ 🚀.");
});

app.use("/api/v1", require("./src/routes/post.route"));
app.use("/api/v1", require("./src/routes/blog.route"));
app.use("/api/v1", require("./src/routes/jobs.route"));
app.use("/api/v1", require("./src/routes/ads.route"));
app.use("/api/v1", require("./src/routes/notice.route"));
app.use("/api/v1", require("./src/routes/poll.route"));
app.use("/api/v1", require("./src/routes/event.route"));
app.use("/api/v1", require("./src/routes/site-update.route"));
app.use("/api/v1", require("./src/routes/feedback.route"));
app.use("/api/v1", require("./src/routes/notification.route"));

async function initializeQueues() {
  try {
    await Promise.all([checkQueueReadiness(CONTENT_MODERATION_QUEUE)]);
  } catch (e) {
    console.error(`Error initializing queues`, e);
    process.exit(1);
  }
}
// database connectivity
mongoose.connect(
  MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  async (err, response) => {
    if (err) {
      console.log(err);
    }
    console.log("MongoDB connected successfully");
    await initializeQueues();
    // listen to server
    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  }
);

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  shutdown();
});

process.on("SIGINT", () => {
  console.info("SIGINT received");
  shutdown();
});

function shutdown() {
  mongoose.connection.close(() => {
    console.info("MongoDB connection closed");
    process.exit(0);
  });
}
