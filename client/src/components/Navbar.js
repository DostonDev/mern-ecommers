import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import langs from "../lang";
import "../styles/Navbar.scss";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useSelector(state => state);
  const { globalState } = useSelector(state => state);
  const { auth } = useSelector(state => state);
  const { isAdmin } = useSelector(state => state);
  const [ setSelectedLang] = useState(lang);
  const dispatch = useDispatch();
  const handleLang = e => {
    dispatch({ type: "LANG", payload: e.target.value });
    setSelectedLang(e.target.value);
  };
  const logout = async () => {
    setIsOpen(false);
    axios
      .get("/user/logout")
      .then(res => {
        localStorage.clear("firstlogin");
        navigate("/");
        dispatch({ type: "AUTH", payload: {} });
        dispatch({ type: "ADMIN", payload: false });
        dispatch({ type: "ADD_TO_CART", payload: [] });
      })
      .catch(err => {
        alert(err.response);
      });
  };
  return (
    <div className="myNavbar">
      {/* <h2>{langs[lang].menu}</h2> */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <button onClick={() => setIsOpen(true)} className="navbar-toggler me-auto" type="button">
            <span className="navbar-toggler-icon"></span>
          </button>
          {isAdmin ? (
            <Link className="navbar-brand me-auto" to="/">
              Admin
            </Link>
          ) : (
            <Link className="navbar-brand me-auto" to="/">
              DevCommerce
            </Link>
          )}
          <div className="d-flex align-items-center">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {isAdmin ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link text-nowrap" aria-current="page" to="/">
                        {langs[lang].products}
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link text-nowrap" aria-current="page" to="/create_product">
                        {langs[lang].createProduct}
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link text-nowrap" aria-current="page" to="/category">
                        {langs[lang].categories}
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link text-nowrap" aria-current="page" to="/history">
                        {langs[lang].history}
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    {auth.accessToken ? (
                      <li className="nav-item">
                        <NavLink className="nav-link text-nowrap" aria-current="page" to="/history">
                          {langs[lang].history}
                        </NavLink>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {auth.accessToken ? (
                  <li className="nav-item">
                    <button
                      onClick={logout}
                      className="btn shadow-none nav-link text-nowrap"
                      aria-current="page"
                      to="/login"
                    >
                      {langs[lang].logout}
                    </button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <NavLink className="nav-link text-nowrap" aria-current="page" to="/login">
                      {langs[lang].loginRegister}
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
            {/* {console.log(auth)} */}
            {auth.user&&auth.user.role!==1 && (
              <Link to="cart" className="btn position-relative shadow-none">
                <img style={{ width: "40px" }} src="/images/cart.png" alt="img" />
                <span className="badge bg-danger p-1 position-absolute" style={{ top: "5px", right: "3px" }}>
                  {globalState.cart.length}
                </span>
              </Link>
            )}

            <select value={lang} onChange={handleLang} className="form-select">
              <option value="Eng">Eng</option>
              <option value="Uz">Uz</option>
            </select>
          </div>
        </div>
      </nav>
      <div className={`secondBar text-center bg-dark text-light ${isOpen ? "secondBarLeft0" : "secondBarLeft100"}`}>
        <div className="position-relative">
          <span onClick={() => setIsOpen(false)} className="closeSpan">
            &times;
          </span>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <NavLink onClick={() => setIsOpen(false)} className="nav-link text-nowrap" aria-current="page" to="/">
                    {langs[lang].products}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    onClick={() => setIsOpen(false)}
                    className="nav-link text-nowrap"
                    aria-current="page"
                    to="/create_product"
                  >
                    {langs[lang].createProduct}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    onClick={() => setIsOpen(false)}
                    className="nav-link text-nowrap"
                    aria-current="page"
                    to="/category"
                  >
                    {langs[lang].categories}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    onClick={() => setIsOpen(false)}
                    className="nav-link text-nowrap"
                    aria-current="page"
                    to="/history"
                  >
                    {langs[lang].history}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {auth.accessToken ? (
                  <li className="nav-item">
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      className="nav-link text-nowrap"
                      aria-current="page"
                      to="/history"
                    >
                      {langs[lang].history}
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
              </>
            )}
            {auth.accessToken ? (
              <li className="nav-item ">
                <button
                  onClick={logout}
                  className="btn shadow-none nav-link text-nowrap mx-auto"
                  aria-current="page"
                  to="/login"
                >
                  {langs[lang].logout}
                </button>
              </li>
            ) : (
              <li className="nav-item ">
                <NavLink
                  onClick={() => setIsOpen(false)}
                  className="nav-link text-nowrap"
                  aria-current="page"
                  to="/login"
                >
                  {langs[lang].loginRegister}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
