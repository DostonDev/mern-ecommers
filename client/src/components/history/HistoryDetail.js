import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import langs from "../../lang";

export default function HistoryDetail() {
  const { histories, history, idState } = useSelector(state => state.globalState);
  const { id } = useParams();
  const { auth, lang } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!history || idState !== id) {
      getHistory();
    }
  }, [id]);
  const getHistory = async () => {
    try {
      if (histories.length === 0) {
        dispatch({ type: "LOADING", payload: true });
        const res = await axios.get(`${auth.user.role === 1 ? "/api/payment" : "/user/getHistory"}`, {
          headers: { Authorization: auth.accessToken },
        });
        res.data.forEach(item => {
          if (item._id == id) {
            dispatch({ type: "GET_HISTORY", payload: item });
            dispatch({ type: "LOADING", payload: false });
            dispatch({ type: "ID_STATE", payload: id });
          }
        });
      } else {
        dispatch({ type: "LOADING", payload: false });
        histories.forEach(item => {
          if (item._id == id) {
            dispatch({ type: "GET_HISTORY", payload: item });
            dispatch({ type: "ID_STATE", payload: id });
          }
        });
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <div>
      <div className="container">
        <h2 className="text-center py-2 pb-1">{langs[lang].historyOrder}</h2>
        {history && history.cart.length ? (
          <div style={{ overflow: "auto" }}>
            <table
              style={{ minWidth: "600px" }}
              className="table table-light table-striped table-hover table-bordered mt-3"
            >
              <thead>
                <tr>
                  <th scope="col">Img</th>
                  <th scope="col">{langs[lang].name}</th>
                  <th scope="col">{langs[lang].quantity}</th>
                  <th scope="col">{langs[lang].price}</th>
                </tr>
              </thead>
              <tbody>
                {history &&
                  history.cart.length &&
                  history.cart.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <img src={item.images.url} style={{ width: "200px" }} alt="" />
                      </th>
                      <th scope="row">{item.title}</th>
                      <th scope="row">{item.quantity}</th>
                      <td>{item.price}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-center">{langs[lang].noData}</h3>
        )}
      </div>
    </div>
  );
}
