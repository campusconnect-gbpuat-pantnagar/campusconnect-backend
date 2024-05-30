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

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// middlewares

app.use(morgan("dev"));
app.use(cors());
app.use(cookieparser());
app.use(express.json());
// routes

// app.get("/api/v1/test", AuthMiddleware, isAdmin, (req, res, next) => {
//   console.log(req.user.id);
//   res.send("this is a test route");
// });

app.use("/api/v1", require("./src/routes/post.route"));
// app.use("/api/v1", require("./src/routes/blog.route"));
// app.use("/api/v1", require("./src/routes/jobs.route"));
// app.use("/api/v1", require("./src/routes/ad.route"));
// app.use("/api/v1", require("./routes/notice.route"));
// app.use("/api/v1", require("./routes/poll.route"));
// app.use("/api/v1", require("./routes/event.route"));
// app.use("/api/v1", require("./routes/update.route"));
// app.use("/api/v1", require("./routes/feedback.route"));
// app.use("/api/v1", require("./routes/notification.route"));
app.get("/api/v1/healthcheck", (req, res) => {
  res.send("CAMPUSCONNECT BACKEND SERVICE  IS HEALTHY ✅ 🚀.");
});

// database connectivity
mongoose.connect(
  MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, response) => {
    if (err) {
      console.log(err);
    }
    console.log("MongoDB connected successfully");

    // listen to server
    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  }
);
