const { Router } = require("express");
const courseRouter = Router();
  
// display all the courses
courseRouter.post("/purchase", function (req, res) {
  res.json({
    message: "course purcahse endpoint",
  });
});

// when the user wants to purchase a course
courseRouter.get("/preview", function (req, res) {
  res.json({
    message: "course preview endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
