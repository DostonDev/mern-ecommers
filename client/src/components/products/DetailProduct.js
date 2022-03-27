import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import langs from "../../lang";
import { getDataAPI } from "../../utils/DataAPIs";
import AddToCartButton from "./AddToCartButton";
import Product from "./Product";

export default function DetailProduct() {
  const { products, lang } = useSelector(state => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetChdata = async () => {
      dispatch({ type: "LOADING", payload: true });
      // dispatch({ type: "LOADING", payload: true });
      const res = await getDataAPI("products");
      dispatch({ type: "GET_PRODUCT", payload: res.data.products });
      // dispatch({ type: "LOADING", payload: false });
      setProduct(res.data.products.find(item => item._id == id));
      dispatch({ type: "LOADING", payload: false });
    };
    if (products.length === 0) {
      fetChdata();
    } else {
      setProduct(products.find(item => item._id == id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [id]);
  
  return (
    <div>
      <div className="container py-2">
        <div className="row">
          <div className="col-md-6">
            <img src={product.images && product.images.url} className="w-100" alt="img" />{" "}
          </div>
          <div className="col-md-6">
            <h4>{product.title}</h4>
            <h5>
              <b>{langs[lang].price}: </b>
              {product.price}$
            </h5>
            <p>
              <b>{langs[lang].description}: </b>
              {product.description}
            </p>
            <p>
              <b>{langs[lang].content}: </b>
              {product.content}
            </p>
            <p>
              <b>{langs[lang].sold}: </b>
              {product.sold}
            </p>
            <AddToCartButton style={{ maxWidth: "20%" }} product={product} />
          </div>
        </div>
        <hr />
        <h3>Related products</h3>
        <div className="row">
          {products.map((item, index) => {
            return item.category === product.category && item._id !== product._id ? (
              <Product key={index} product={item} />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
