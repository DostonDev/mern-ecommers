import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import langs from "../../lang";

export default function History() {
  const { histories } = useSelector(state => state.globalState);
  const token = useSelector(state => state.auth.accessToken);
  const { auth, lang } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(() => {
    if (histories.length === 0) {
      getHistory();
    }
    dispatch({ type: "GET_HISTORY", payload: null });
  }, []);
  const getHistory = () => {
    dispatch({ type: "LOADING", payload: true });
    axios
      .get(`${auth.user.role === 1 ? "/api/payment" : "/user/getHistory"}`, { headers: { Authorization: token } })
      .then(res => {
        dispatch({ type: "LOADING", payload: false });
        dispatch({ type: "GET_HISTORIES", payload: res.data });
      })
      .catch(err => {
        dispatch({ type: "LOADING", payload: false });
        console.log(err.response);
      });
  };
  return (
    <div>
      <div className="container text-center pt-2">
        <h4>{langs[lang].history}</h4>
        <h6>You have {histories.length} history</h6>
        <div style={{ overflow: "auto" }}>
          <table
            style={{ minWidth: "700px" }}
            className="table table-light table-striped table-hover table-bordered mt-3"
          >
            <thead>
              <tr>
                <th scope="col">Payment ID</th>
                <th scope="col">{langs[lang].dateOfPurchased}</th>
                <th scope="col">{langs[lang].show}</th>
              </tr>
            </thead>
            <tbody>
              {histories.length ? (
                histories.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{item._id}</th>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/history/${item._id}`}>{langs[lang].view}</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
