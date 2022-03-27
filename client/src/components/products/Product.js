import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import "../../styles/Product.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import langs from "../../lang";

export default function Product({ product, isAdmin, deleteProduct, myCheck }) {
  const { auth, lang } = useSelector(state => state);

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-2 products">
      <div className="card h-100 position-relative">
        {auth.user && auth.user.role === 1 && (
          <input
            checked={product.checked}
            onChange={() => myCheck(product._id)}
            type="checkbox"
            name="check"
            className="checkBox"
          />
        )}

        <img
          src={product.images.url}
          style={{ height: "320px", objectFit: "cover" }}
          className="card-img-top"
          alt="..."
          loading="lazy"
        />
        <hr className="mt-0" />
        <div className="card-body pt-0 d-flex flex-column justify-content-between">
          <div className="mb-2">
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text mb-0">
              <b>{langs[lang].price}: </b> {product.price}$
            </p>
            <p className="card-text mb-0">
              <b>{langs[lang].category}:</b> {product.category}
            </p>
            <p className="card-text descr">
              <b>{langs[lang].description}:</b> {product.description}
            </p>
          </div>
          <div>
            {isAdmin ? (
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-success d-block w-100" onClick={() => deleteProduct(product)}>
                  {langs[lang].delete}
                </button>
                <Link to={`/edit_product/${product._id}`} className="btn btn-primary d-block w-100 ms-3">
                  {langs[lang].edit}
                </Link>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <AddToCartButton product={product} />
                <Link to={`/detail/${product._id}`} className="btn btn-primary d-block w-100 ms-3">
                  {langs[lang].view}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
