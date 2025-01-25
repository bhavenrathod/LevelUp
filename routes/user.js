const { Router } = require("express"); // destructure the object here
const { userModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/userMiddleware");
// const { USER_JWT_PASSWORD } = require("../config");

const userRouter = Router(); // use the function here

// signup endpoint
userRouter.post("/signup", async function (req, res) {
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

    await userModel.create({
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

// signin endpoint
userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
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
      process.env.USER_JWT_PASSWORD
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

// display the user's purchased courses
userRouter.get("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const purchases = await purchaseModel.find({
    userId,
  });

  res.json({
    purchases,
  });
});

module.exports = {
  userRouter: userRouter,
};
