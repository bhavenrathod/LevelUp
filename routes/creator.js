const { Router } = require("express");
const creatorRouter = Router();
const { creatorModel } = require("../db");

creatorRouter.post("/signup", function (req, res) {
  res.json({
    message: "admin signup success",
  });
});

creatorRouter.post("/signin", function (req, res) {
  res.json({
    message: "admin signin success",
  });
});

// course creation
creatorRouter.post("/course", function (req, res) {
  res.json({
    message: "course creation",
  });
});

// update course
creatorRouter.put("/course", function (req, res) {
  res.json({
    message: "course updation",
  });
});

// get all course
creatorRouter.get("/course/all", function (req, res) {
  res.json({
    message: "course creation",
  });
});

module.exports = {
  creatorRouter: creatorRouter,
};
