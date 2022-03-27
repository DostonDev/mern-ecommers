import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import langs from "../../lang";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.globalState);
  const { auth, lang } = useSelector(state => state);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
  }, []);

  const getCategories = () => {
    dispatch({ type: "LOADING", payload: true });
    axios
      .get("/api/category", { headers: { Authorization: auth.accessToken } })
      .then(res => {
        dispatch({ type: "GET_CATEGORIES", payload: res.data });
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    dispatch({ type: "LOADING", payload: false });
  };

  const addCategory = () => {
    dispatch({ type: "LOADING", payload: true });
    if (isEdit) {
      axios
        .put(`/api/category/${editId}`, { name }, { headers: { Authorization: auth.accessToken } })
        .then(res => {
          getCategories();
          setName("");
          setIsEdit(false);
          console.log(res);
          toast.success(res.data.msg);
        })
        .catch(err => {
          toast.error(err.response.data.msg);
        });
    } else {
      axios
        .post("/api/category", { name }, { headers: { Authorization: auth.accessToken } })
        .then(res => {
          getCategories();
          setName("");
          console.log(res);
          toast.success(res.data.msg);
        })
        .catch(err => {
          toast.error(err.response.data.msg);
        });
    }
    dispatch({ type: "LOADING", payload: false });
  };

  const editCategory = (id, name) => {
    setName(name);
    setEditId(id);
    setIsEdit(true);
  };
  const deleteCategory = id => {
    dispatch({ type: "LOADING", payload: true });
    axios
      .delete(`/api/category/${id}`, { headers: { Authorization: auth.accessToken } })
      .then(res => {
        getCategories();
        toast.success(res.data.msg);
      })
      .catch(err => {
        toast.error(err.response.data.msg);
      });
  };

  return (
    <div>
      <div className="container py-3">
        <div className="row align-items-start">
          <div className="col-lg-6 d-flex mb-2">
            <input
              onChange={e => setName(e.target.value)}
              value={name}
              type="text"
              placeholder={`${langs[lang].category}...`}
              className="form-control me-2"
            />
            <button className="btn btn-outline-dark" onClick={addCategory}>
              {isEdit ? `${langs[lang].edit}` : `${langs[lang].add}`}
            </button>
          </div>
          <div className="col-lg-6">
            {categories.length &&
              categories.map((item, index) => (
                <div key={index} className="d-flex align-items-center justify-content-between border p-1 px-2">
                  <h4 className="m-0">{item.name}</h4>
                  <div>
                    <button onClick={() => editCategory(item._id, item.name)} className="btn btn-warning me-2">
                      {langs[lang].edit}
                    </button>
                    <button onClick={() => deleteCategory(item._id)} className="btn btn-danger">
                      {langs[lang].delete}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
