const { Router } = require("express"); // destructure the object here
const { userModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");

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
      message: "Signed up successfully",
    });
  } catch (error) {
    console.log("Error in DB");
    return res.status(400).json({
      message: "User already exists",
    });
  }
});

// signin endpoint
userRouter.post("/signin", function (req, res) {
  res.json({
    message: "user signin success",
  });
});

// display the user's purchased courses
userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "user purchased courses",
  });
});

module.exports = {
  userRouter: userRouter,
};
