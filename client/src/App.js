import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomeComponent from "./components/Home-component";
import NavComponent from "./components/Nav-component";
import RegisterComponent from "./components/Register-component";
import LoginComponent from "./components/Login-component";
import ProfileComponent from "./components/Profile-component";
import CourseComponent from "./components/Course-component";
import PostCourseComponent from "./components/PostCourse-component";
import EnrollComponent from "./components/Enroll-component";
import AuthService from "./services/auth.service";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <div>
      <NavComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<HomeComponent />} exact></Route>
      </Routes>
      <Routes>
        <Route path="/register" element={<RegisterComponent />} exact></Route>
      </Routes>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          exact
        ></Route>
      </Routes>
      <Routes>
        <Route
          path="/profile"
          element={
            <ProfileComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          exact
        ></Route>
      </Routes>
      <Routes>
        <Route
          path="/course"
          element={
            <CourseComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          exact
        ></Route>
      </Routes>
      <Routes>
        <Route
          path="/postcourse"
          element={
            <PostCourseComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          exact
        ></Route>
      </Routes>
      <Routes>
        <Route
          path="/enroll"
          element={
            <EnrollComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
          exact
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
