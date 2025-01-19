const { Schema, default: mongoose } = require("mongoose");
const user = require("./routes/user");
const course = require("./routes/course");
const ObjectId = mongoose.ObjectId;

require("dotenv").config();

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});

const creatorSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const purchaseSchema = new Schema({
  courseId: ObjectId,
  creatorId: ObjectId,
});

// corresponding Data models
const userModel = mongoose.model("users", userSchema);
const creatorModel = mongoose.model("creators", creatorSchema);
const courseModel = mongoose.model("courses", courseSchema);
const purchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
  userModel,
  creatorModel,
  courseModel,
  purchaseModel,
};
