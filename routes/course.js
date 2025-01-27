const { Router } = require("express");
const { userMiddleware } = require("../middleware/userMiddleware");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

// to purchase a course
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;
  // check if user has already paid the price
  await purchaseModel.create({
    userId,
    courseId,
  });
  res.json({
    message: "You have purchased the course",
  });
});

// display all the courses
courseRouter.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});

  res.json({
    courses,
  });
});

module.exports = {
  courseRouter: courseRouter,
};
