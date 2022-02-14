import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const RegisterComponent = () => {
  let navigate = useNavigate();
  let [member, setMember] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  let [message, setMessage] = useState("");

  // set the value of member object when the user entered them.
  let handleChangeMember = (e) => {
    let newMember = { ...member };
    newMember[e.target.name] = e.target.value;
    console.log(newMember);
    setMember(newMember);
  };

  // when someone click the register button, we all the AuthService function and send the data to it.
  let handleResgister = () => {
    let { username, email, password, role } = member;
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert(
          "Registration succeeds. You are now redirected to the login page."
        );
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.response);
        setMessage(err.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={handleChangeMember}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            onChange={handleChangeMember}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChangeMember}
          />
        </div>
        <br />
        <div className="form-group">
          <label>role</label>
          <select
            className="form-control"
            name="role"
            onChange={handleChangeMember}
          >
            <option>Please select your charactor</option>
            <option>instructor</option>
            <option>student</option>
          </select>
        </div>
        <br />
        <button className="btn btn-primary" onClick={handleResgister}>
          <span>Register</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
