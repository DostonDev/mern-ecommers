import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { auth } = useSelector(state => state);
  const naviagate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [cf_pass, setCf_pass] = useState(true);

  useEffect(() => {
    if (auth.accessToken) {
      naviagate("/");
    }
    console.log(auth.accessToken);
  }, [auth]);

  const handleInput = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const registered = async e => {
    e.preventDefault();
    axios
      .post("/user/register", state)
      .then(res => {
        dispatch({ type: "AUTH", payload: res.data });
        localStorage.setItem("firstlogin", true);
        naviagate("/");
      })
      .catch(err => {
        console.log(err.response);
      });
  };
  return (
    <div className="register">
      <div style={{ height: "100vh" }} className="d-flex align-items-center justify-content-center w-100">
        <div className="row w-100">
          <div className="col-lg-4 offset-lg-4 col-md-6 col-sm-8 offset-sm-2 offset-md-3 col-10 offset-1">
            <div className="card ">
              <div className="card-header text-center">
                <h2>Sign Up</h2>
              </div>
              <div className="card-body">
                <form onSubmit={registered}>
                  <input
                    onChange={handleInput}
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter your name..."
                  />
                  <input
                    onChange={handleInput}
                    type="email"
                    className="form-control mt-3"
                    name="email"
                    placeholder="Enter your email..."
                  />
                  <p className="text-end mb-0 text-muted ms-auto mt-2">
                    <span style={{ cursor: "pointer" }} onClick={() => setCf_pass(!cf_pass)}>
                      {cf_pass ? "Show" : "Hide"}
                    </span>
                  </p>
                  <input
                    onChange={handleInput}
                    type={cf_pass ? "password" : "text"}
                    className="form-control mt-0"
                    name="password"
                    placeholder="Enter your password..."
                    style={{
                      backgroundColor: alert.password ? "#fd2d6a14" : "",
                    }}
                  />

                  <button type="submit" className="btn mt-2 btn-primary mx-auto d-block">
                    Register
                  </button>
                </form>
              </div>
              <div className="card-footer text-muted text-center">
                <Link className="text-decoration-none " to="/login">
                  Already have an account. Login?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
