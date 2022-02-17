import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  let navigate = useNavigate();
  function handleTakeToLogin() {
    navigate("/login");
  }

  // get the course data once getting into the page.
  let [courseData, setCourseData] = useState(null);
  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
    }

    if (currentUser.user.role === "instructor") {
      courseService
        .get(_id)
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.user.role == "student") {
      courseService
        .getEnrolledCourses(_id)
        .then((data) => {
          console.log("student", data);
          setCourseData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {/* if you're not the member */}
      {!currentUser && (
        <div>
          <p>You must login before seeing your courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page
          </button>
        </div>
      )}

      {/* if you're a member(instructor or student) */}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>Welcome to instructor's Course page.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div>
          <h1>Welcome to student's Course page.</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length !== 0 && (
        <div>
          <p>Here's the data we got back from server.</p>
          {courseData.map((course) => (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p className="card-text">
                  Student count : {course.student.length}
                </p>
                <button className="btn btn-primary me-2">
                  $ {course.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
