const { Router } = require("express");
const creatorRouter = Router();
const { creatorModel, courseModel } = require("../db");
// const { CREATOR_JWT_PASSWORD } = require("../config");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { creatorMiddleware } = require("../middleware/creatorMiddleware");

creatorRouter.post("/signup", async function (req, res) {
  // input validation using zod
  const requiredBody = z.object({
    firstName: z.string().min(4).max(100),
    lastName: z.string().min(4).max(100),
    email: z.string().email().min(4).max(100),
    password: z
      .string()
      .min(4)
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      ),
  });

  // parsing the string
  const parsedString = requiredBody.safeParse(req.body);
  if (!parsedString) {
    res.json({
      message: "Incorrect Format",
      error: parsedString.error,
    });
  }

  const { firstName, lastName, email, password } = req.body; // destructuring the body

  // password hashing
  const saltNumber = 5;
  try {
    const hashedPassword = await bcrypt.hash(password, saltNumber);

    await creatorModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    return res.json({
      message: "Signed Up",
    });
  } catch (error) {
    console.log("Error in DB");
    return res.status(400).json({
      message: "User already exists",
    });
  }
});

creatorRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await creatorModel.findOne({ email: email });
    if (!user) {
      return res.status(403).json({
        message: "Incorrect Credentials",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Incorrect Credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.CREATOR_JWT_PASSWORD
    );

    //Respond with the token
    return res.json({
      message: "Signed In",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred",
      error: error.message,
    });
  }
});

// course creation
creatorRouter.post("/course", creatorMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, price, imageURL, creatorId } = req.body;

  const course = await courseModel.create({
    title: title,
    description: description,
    price: price,
    imageURL: imageURL, // creating a web3 saas in 6hrs (how to upload an image directly)
    creatorId: adminId,
  });

  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

// update course
creatorRouter.put("/course", creatorMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, price, imageURL, courseId } = req.body;

  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      price: price,
      imageURL: imageURL, // creating a web3 saas in 6hrs (how to upload an image directly)
    }
  );

  res.json({
    message: "Course updated",
    courseId: course._id,
  });
});

// get all course
creatorRouter.get("/course/all", creatorMiddleware, async function (req, res) {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "Courses shown",
    courses,
  });
});

module.exports = {
  creatorRouter: creatorRouter,
};
