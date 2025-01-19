const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { creatorRouter } = require("./routes/creator");
const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/creator", creatorRouter);

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("listening");
  app.listen(port);
}

main();
