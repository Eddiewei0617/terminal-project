const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A request is coming into auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  return res.json(msgObj);
});

// if someone registered
router.post("/register", async (req, res) => {
  console.log("Register!");
  // console.log(registerValidation(req.body));
  const { error } = registerValidation(req.body);
  // error.details:
  // [
  //   {
  //     message: '"role" must be one of [student, instructor]',
  //     path: [ 'role' ],
  //     type: 'any.only',
  //     context: { valids: [Array], label: 'role', value: 'dsfdsfsdf', key: 'role' }
  //   }
  // ]
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Email has already been registered.");

  // register the user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      savedObject: saveUser,
    });
  } catch (err) {
    res.status(400).send("User not saved.");
  }
});

// login
router.post("/login", (req, res) => {
  // check the validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if there are any err or non-user
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("User not found.");
    } else {
      // 有找到的話，看密碼與資料庫的密碼相不相符:
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);
        if (isMatch) {
          // 這個部分是JWT的usage，sign裡面擺你想簽名的物件，然後是加密
          const tokenObject = { _id: user.id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong password.");
        }
      });
    }
  });
});

module.exports = router;
