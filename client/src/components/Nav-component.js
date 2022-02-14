import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const NavComponent = () => {
  let navigate = useNavigate();
  let handleLogout = () => {
    AuthService.logout();
    window.alert(
      "Logout Successfully. Now you are redirected to the homepage."
    );
    navigate("/");
  };

  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link onClick={handleLogout} className="nav-link" to="#">
                    Logout
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    onClick={handleLogout}
                    className="nav-link"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
};

export default NavComponent;
