import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import langs from "../../lang";

export default function AddToCartButton({ product, style }) {
  const { globalState } = useSelector(state => state);
  const { auth, lang } = useSelector(state => state);
  const dispatch = useDispatch();

  const addToCart = async () => {
    if (auth.accessToken) {
      let cart = globalState.cart;
      const isNo = cart.every(item => {
        return item._id !== product._id;
      });
      if (isNo) {
        const NewProduct = product;
        NewProduct.quantity = 1;
        cart.push(NewProduct);
        axios
          .put("/user/addCart", { cart }, { headers: { Authorization: auth.accessToken } })
          .then(res => {
            toast.success(res.data.msg);
          })
          .catch(err => {
            toast.error(err.response.msg);
          });
        dispatch({ type: "ADD_TO_CART", payload: cart });
      } else {
        toast.error("This product already exist.");
      }
    } else {
      toast.error("Please login to continue buying.");
    }
  };

  return (
    <button className="btn btn-success w-100" style={style} onClick={addToCart}>
      {langs[lang].buy}
    </button>
  );
}
