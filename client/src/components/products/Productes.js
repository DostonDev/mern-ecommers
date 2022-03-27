import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import langs from "../../lang";
import Filter from "../Filter/Filter";
import LoadMore from "../Filter/LoadMore";
// import Pagination from "../Filter/Pagination";
import Product from "./Product";

export default function Productes() {
  const { products, lang, isAdmin, auth } = useSelector(state => state);
  const { isChange } = useSelector(state => state.globalState);
  const [state] = useState({ category: "", sort: "sort=-createdAt", search: "" });

  const dispatch = useDispatch();
  useEffect(() => {
    if (isChange) {
      getProducts();
      console.log("11");
    }
  }, [isChange]);
  useEffect(() => {
    if (products.length === 0) {
      getProducts();
    }
  }, []);

  const getProducts = () => {
    dispatch({ type: "LOADING", payload: true });
    dispatch({ type: "CHANGE", payload: false });
    axios
      .get(`/api/products?limit=${8}&${state.category}&${state.sort}&title[regex]=${state.search}`)
      .then(res => {
        dispatch({ type: "LOADING", payload: false });
        dispatch({ type: "GET_PRODUCT", payload: res.data.products });
      })
      .catch(err => {
        toast.error(err.response.data.msg);
      });
  };

  const deleteProduct = async item => {
    try {
      dispatch({ type: "LOADING", payload: true });
      const delImg = axios.post(
        "/api/destroy",
        { public_id: item.images.public_id },
        { headers: { Authorization: auth.accessToken } }
      );
      const delItem = axios.delete(`/api/products/${item._id}`, { headers: { Authorization: auth.accessToken } });
      await delImg;
      await delItem;
      getProducts();
    } catch (error) {
      dispatch({ type: "LOADING", payload: false });
      toast.error(error.response.data.msg);
      // console.log(error.response.data.msg);
    }
  };

  const myCheck = id => {
    const myProductes = [...products];
    myProductes.forEach((item, index) => {
      if (item._id === id) {
        item.checked = !item.checked;
      }
    });
    console.log(myProductes);
    dispatch({ type: "GET_PRODUCT", payload: myProductes });
  };

  const selectAll = e => {
    const myProductes = [...products];
    myProductes.forEach((item, index) => {
      if (e.target.checked) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    dispatch({ type: "GET_PRODUCT", payload: myProductes });
  };

  const deleteAll = () => {
    const myProductes = [...products];
    myProductes.forEach((item, index) => {
      if (item.checked) {
        deleteProduct(item);
      }
    });
    dispatch({ type: "GET_PRODUCT", payload: myProductes });
  };

  return (
    <div className="container py-2">
      <Filter />
      {products.length ? (
        <>
          {auth && auth.user && auth.user.role === 1 ? (
            <>
              <div className="text-end">
                <div className=" d-flex align-items-center justify-content-end">
                  <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                  {langs[lang].selectAll}
                  </label>
                  <input
                    onChange={selectAll}
                    className="form-check-input me-2 ms-1 shadow-none"
                    type="checkbox"
                    value=""
                    id="flexCheckIndeterminate"
                  />
                  <button onClick={deleteAll} className="btn btn-outline-dark">
                  {langs[lang].deleteAll}
                  </button>
                </div>
              </div>
              <hr />
            </>
          ) : (
            ""
          )}

          <div className="row pt-2">
            {products.map((item, index) => (
              <Product
                key={index}
                product={item}
                myCheck={id => myCheck(id)}
                isAdmin={isAdmin}
                deleteProduct={item => deleteProduct(item)}
              />
            ))}
          </div>

          <LoadMore result={products.result} />
          {/* <Pagination /> */}
        </>
      ) : (
        <h1 className="text-center mt-4">{langs[lang].noData}</h1>
      )}
    </div>
  );
}
