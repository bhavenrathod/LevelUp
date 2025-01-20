const { Router } = require("express");
const creatorRouter = Router();
const { creatorModel } = require("../db");
const USER_CREATOR_PASSWORD = "admin123";
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      USER_CREATOR_PASSWORD
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
