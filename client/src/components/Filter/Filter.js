import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import langs from "../../lang";

export default function Filter() {
  const dispatch = useDispatch();
  const { auth, lang } = useSelector(state => state);
  const { page } = useSelector(state => state.globalState);
  const [categories, setCategories] = useState(undefined);
  const [state, setState] = useState({ category: "", sort: "sort=-createdAt", search: "" });

  useEffect(() => {
    axios
      .get("/api/category", { headers: { Authorization: auth.accessToken } })
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.log(err.response.data.msg);
      });
  }, [auth]);

  useEffect(() => {
    // console.log(11);
    dispatch({ type: "LOADING", payload: true });
    axios
      .get(`/api/products?limit=${page * 8}&${state.category}&${state.sort}&title[regex]=${state.search}`, {
        headers: { Authorization: auth.accessToken },
      })
      .then(res => {
        dispatch({ type: "GET_PRODUCT", payload: res.data.products });
        dispatch({ type: "LOADING", payload: false });
      })
      .catch(err => {
        // console.log(err.response);
        dispatch({ type: "LOADING", payload: false });
      });
  }, [state, page, auth,dispatch]);

  const handleFilter = async e => {
    const { name, value } = e.target;
    await setState({ ...state, [name]: value });
  };
  return (
    <div className="mb-2">
      <div>
        <div className="d-flex align-items-center">
          <h4 className="m-0 me-1">Filter:</h4>
          <select
            name="category"
            onChange={handleFilter}
            className="form-select me-2 w-25"
            aria-label="Default select example"
          >
            <option value="">{langs[lang].allProducts}</option>
            {categories &&
              categories.map((item, index) => (
                <option key={index} value={`category=${item.name}`}>
                  {item.name}
                </option>
              ))}
          </select>
          <input
            onChange={handleFilter}
            name="search"
            type="text"
            className="form-control me-2"
            placeholder={`${langs[lang].search}...`}
          />
          <h4 className="m-0 me-1">Sort:</h4>
          <select onChange={handleFilter} name="sort" className="form-select w-25" aria-label="Default select example">
            <option value="sort=-createdAt">{langs[lang].newest}</option>
            <option value="sort=createdAt">{langs[lang].oldest}</option>
            <option value="sort=-sold">{langs[lang].bestSales}</option>
            <option value="sort=price">{langs[lang].lowPrice}</option>
            <option value="sort=-price">{langs[lang].highPrice}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
