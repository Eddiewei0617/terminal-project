const router = require("express").Router();
const Course = require("../models").courseModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
});

// in the course page:
router.get("/", (req, res) => {
  // populate的意思是: 想得到該user的某些擴充資訊
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Error!! Cannot get courses");
    });
});

// which instructor is at course page
router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.send(data);
      console.log("instructor data : ", data);
    })
    .catch((err) => {
      res.status(500).send("Cannot get course data.");
    });
});

// make a route for a course for student
router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;

  // 如果在搜尋bar想用像是MySQL的 Like% 語法:
  // db.users.find({name: {$regex: 'sometext'}})
  Course.find({ title: { $regex: name } })
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.status(200).send(course);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// which student is at the course page
router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  Course.find({ student: _student_id })
    .populate("instructor", ["username", "email"])
    .then((courses) => {
      res.status(200).send(courses);
    })
    .catch((err) => {
      res.status(500).send("Cannot get course data.");
    });
});

// search for the single course
router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((err) => {
      res.send(err);
    });
});

// post the course amd save them
router.post("/", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 檢查是學生還是講師才能post
  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructors can post a new course.");
  }
  /*   console.log("req.user", req.user);  => passport提供給我們用的
     {
       _id: new ObjectId("6203376c87481de706349278"),
       username: 'monkey',
       email: 'monkey@test.com',
       password: '$2b$10$Cg5VW6d/WRTTfib3Qy7uiebB/aGFgQwi0/9vEF70CaNLaLQUqefI.',
       role: 'instructor',
       date: 2022-02-09T03:39:24.916Z,
       __v: 0
     }   
  */

  // 講師post並且save進資料庫
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot be saved.");
  }
});

// the students enroll courses
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  let { user_id } = req.body;
  try {
    let course = await Course.findOne({ _id });
    course.student.push(user_id);
    await course.save();
    res.send("Done enrollment.");
  } catch (err) {
    res.send(err);
  }
});

// Update the course data
router.patch("/:_id", async (req, res) => {
  // validate the inputs before updating a course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found",
    });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => [res.send("Course updated.")])
      .catch((err) => {
        res.send({
          success: false,
          message: err,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of the course or the web admin can update it.",
    });
  }
});

// Delete the course
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found",
    });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => [res.send("Course deleted.")])
      .catch((err) => {
        res.send({
          success: false,
          message: err,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of the course or the web admin can delete it.",
    });
  }
});

module.exports = router;
