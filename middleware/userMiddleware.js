const jwt = require("jsonwebtoken");
// const { USER_JWT_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, process.env.USER_JWT_PASSWORD);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    return res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  userMiddleware,
};
