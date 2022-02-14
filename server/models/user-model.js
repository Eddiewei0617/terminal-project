const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor"], // enum是指，只能存入列舉的這些答案
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// make some function for verifying which character is the user
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};
userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};

// mongoose schema middleware
// 存進來之前先檢查此密碼是否有被更改過或是新的，符合以上的話就給他加密存起來
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

// 比對密碼middleware
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
