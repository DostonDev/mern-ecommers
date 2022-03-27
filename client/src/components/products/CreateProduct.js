import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import langs from "../../lang";
import "../../styles/CreateProduct.scss";

export default function CreateProduct() {
  const [images, setImages] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(undefined);
  const { auth, products, lang } = useSelector(state => state);
  const initialState = {
    product_id: "",
    title: "",
    price: "",
    description:
      "Introducing the all-new Make it Big Podcast — a thought leadership audio series for retailers, entrepreneurs and ecommerce professionals.",
    content:
      "Effective product descriptions can possibly lure potential customers. Good product descriptions can potentially influence a purchase decision. Great product descriptions can ultimately help improve conversion rates and increase sales, as well as boost your visibility and SEO on paid channels.",
    category: "",
  };
  const [data, setData] = useState(initialState);

  useEffect(() => {
    dispatch({ type: "LOADING", payload: true });
    axios
      .get("/api/category", {
        headers: {
          Authorization: auth.accessToken,
        },
      })
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        toast.error(err.response.data.msg);
      });
    if (products.length === 0) {
      axios
        .get("/api/products")
        .then(res => {
          res.data.products.forEach((item, index) => {
            if (item._id == id) {
              console.log(item);
              setData(item);
              setImages(item.images);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      products.forEach((item, index) => {
        if (item._id == id) {
          console.log(item);
          setData(item);
          setImages(item.images);
        }
      });
    }
    dispatch({ type: "LOADING", payload: false });
  }, [auth]);

  const handleInput = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const selectImage = e => {
    if (auth.user.role !== 1) return toast.error("You are not admin.");
    const file = e.target.files[0];
    if (!file) return toast.error("File not exist.");
    if (file.size > 1024 * 1024 * 5) return toast.error("File size too large.");
    if (!(file.type === "image/png" || file.type === "image/jpeg")) return toast.error("File format is inCorrect.");
    const formData = new FormData();
    formData.append("file", file);
    dispatch({ type: "LOADING", payload: true });
    axios
      .post("/api/upload", formData, {
        headers: { Authorization: auth.accessToken, "content-type": "multipart/form-data" },
      })
      .then(res => {
        setImages(res.data);
        dispatch({ type: "LOADING", payload: false });
      })
      .catch(err => {
        toast.error(err.response.data.msg);
        dispatch({ type: "LOADING", payload: false });
      });
  };

  const destroyImg = () => {
    dispatch({ type: "LOADING", payload: true });
    axios
      .post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: auth.accessToken },
        }
      )
      .then(res => {
        setImages("");
        dispatch({ type: "LOADING", payload: false });
        console.log(res);
      })
      .catch(err => {
        toast.error(err.response.data.msg);
        dispatch({ type: "LOADING", payload: false });
      });
  };

  const createProduct = async () => {
    try {
      dispatch({ type: "LOADING", payload: true });
      let res;
      if (id) {
        res = await axios.put(
          `/api/products/${id}`,
          { ...data, images },
          { headers: { Authorization: auth.accessToken } }
        );
      } else {
        res = await axios.post("/api/products", { ...data, images }, { headers: { Authorization: auth.accessToken } });
      }
      dispatch({ type: "CHANGE", payload: true });
      setData(initialState);
      setImages("");
      navigate("/");
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
    dispatch({ type: "LOADING", payload: false });
  };

  return (
    <div className="createProduct">
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-2">
            <div className="card h-100">
              <input onChange={selectImage} type="file" className={`w-100 h-100 ${images ? "noFile" : "file"}`} />
              {/* <img src="/images/plus.png" alt="plus" className="plus" /> */}
              {images ? (
                <img className="product" src={images.url} alt="img" />
              ) : (
                <div style={{ height: "500px" }}></div>
              )}
              <span onClick={destroyImg} className="close">
                x
              </span>
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1">
            <input
              onChange={handleInput}
              type="text"
              placeholder="ProductId..."
              name="product_id"
              className="form-control mb-2"
              value={data.product_id}
            />
            <input
              onChange={handleInput}
              type="text"
              placeholder={`${langs[lang].title}...`}
              name="title"
              className="form-control mb-2"
              value={data.title}
            />
            <input
              onChange={handleInput}
              type="number"
              placeholder={`${langs[lang].price}...`}
              name="price"
              className="form-control mb-2"
              value={data.price}
            />
            <textarea
              onChange={handleInput}
              type="text"
              placeholder={`${langs[lang].description}...`}
              name="description"
              className="form-control mb-2"
              value={data.description}
              rows="3"
            />
            <textarea
              onChange={handleInput}
              type="text"
              placeholder={`${langs[lang].content}...`}
              name="content"
              className="form-control mb-2"
              value={data.content}
              rows="4"
            />
            <select onChange={handleInput} name="category" value={data.category} className="form-select mb-2">
              <option value="">{`${langs[lang].selectCategory}`}</option>
              {categories &&
                categories.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
            <button onClick={createProduct} className="btn btn-dark d-block w-100">
              {id ? `${langs[lang].edit}...` : `${langs[lang].create}...`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
