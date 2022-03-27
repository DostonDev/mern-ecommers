import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const state = useSelector(state => state);
  const initialData = { email: "", password: "" };
  const [userData, setUserData] = useState(initialData);
  const { email, password } = userData;
  const handleInput = e => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // try {
    dispatch({ type: "LOADING", payload: true });
    axios
      .post("/user/login", userData)
      .then(res => {
        console.log(res);
        dispatch({ type: "AUTH", payload: res.data });
        dispatch({ type: "ADD_TO_CART", payload: res.data.user.cart });
        localStorage.setItem("firstlogin", true);
        if (res.data.user.role === 1) {
          dispatch({ type: "ADMIN", payload: true });
        }
        dispatch({ type: "LOADING", payload: false });
      })
      .catch(err => {
        dispatch({ type: "LOADING", payload: false });
        toast.error(err.response.data.msg);
      });
    // } catch (error) {
    //   toast.error(error.response.data.msg);
    // }
    // dispatch(login(userData));
    // if (!auth.token) {
    // navigate("/");
    //   window.location.href = "/";
    // }
  };
  useEffect(() => {
    if (auth.accessToken) {
      navigate("/");
    }
  }, [auth]);
  return (
    <div>
      <div style={{ height: "100vh" }} className="d-flex align-items-center justify-content-center w-100">
        <div className="row m-0 w-100">
          <div className="col-lg-4 offset-lg-4 col-md-6 col-sm-8 offset-sm-2 offset-md-3 col-10 offset-1">
            <div className="card text-center">
              <div className="card-header">
                <h2>Login</h2>
              </div>
              <div className="card-body">
                {/* {state.err !== "" ? (
              <p className="p-2" style={{ backgroundColor: "crimson", color: "white" }}>
                {state.err}
              </p>
            ) : (
              ""
            )} */}
                <form onSubmit={handleSubmit}>
                  <input
                    onChange={handleInput}
                    type="email "
                    className="form-control mb-3"
                    name="email"
                    placeholder="Enter your email..."
                    required
                    value={userData.email}
                  />
                  <input
                    onChange={handleInput}
                    type="password "
                    className="form-control mb-3"
                    name="password"
                    placeholder="Enter your password..."
                    required
                    value={userData.password}
                  />
                  <button disabled={email && password ? false : true} className="btn btn-primary">
                    Login
                  </button>
                </form>
              </div>
              <div className="card-footer text-muted">
                <Link className="text-decoration-none" to="/register">
                  Dont't have an account. Register?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
