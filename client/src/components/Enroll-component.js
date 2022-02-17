import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseService from "../services/course.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  let navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  // 存輸入的值的狀態
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  // 送出查詢課程後設定取得結果的狀態
  const handleSearch = () => {
    courseService
      .getCourseByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // 學生按下enroll之後
  const handleEnroll = (e) => {
    // if the student has already enrolled the coures:
    let studentArr = searchResult[0].student;
    for (let i = 0; i < studentArr.length; i++) {
      if (searchResult[0].student[i] === currentUser.user._id) {
        window.alert("Sorry, you've already enrolled it.");
        return;
      }
    }
    //  if the student has not enrolled the coures yet:
    courseService
      .enroll(e.target.id, currentUser.user._id)
      .then(() => {
        window.alert("Done Enrollment");
        navigate("/course");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button class="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            class="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length !== 0 && (
        <div>
          <p>Data we got back from API.</p>
          {searchResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>Price: {course.price}</p>
                <p>Student: {course.student.length}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text"
                  className="btn btn-primary"
                  id={course._id}
                >
                  Enroll
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
