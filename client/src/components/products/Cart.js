import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import langs from "../../lang";

export default function Cart() {
  const { globalState } = useSelector(state => state);
  const { auth, lang } = useSelector(state => state);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    let count = 0;
    cart.forEach(item => {
      count += item.price * item.quantity;
    });
    setTotal(count);
  }, [cart, globalState]);

  useEffect(() => {
    setCart(globalState.cart);
  }, [globalState]);

  const removeFromCart = id => {
    if (window.confirm("Do you want to delete this product.")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      changeCartBack();
    }
  };

  const changeCartBack = async () => {
    dispatch({ type: "ADD_TO_CART", payload: cart });
    await axios.put("/user/addCart", { cart }, { headers: { Authorization: auth.accessToken } });
  };

  const incriment = id => {
    cart.forEach(item => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    changeCartBack();
  };
  const dicriment = id => {
    cart.forEach(item => {
      if (item._id === id && item.quantity > 1) {
        item.quantity -= 1;
      }
    });
    setCart([...cart]);
    changeCartBack();
  };
  const payPal = () => {
    if (cart.length === 0) {
      toast.error("No products :(");
    } else {
      axios
        .post(
          "/api/payment",
          { cart, paymentId: "ID", address: "Adress" },
          { headers: { Authorization: auth.accessToken } }
        )
        .then(async res => {
          setCart([]);
          await axios.put("/user/addCart", { cart: [] }, { headers: { Authorization: auth.accessToken } });
          dispatch({ type: "ADD_TO_CART", payload: [] });
          dispatch({ type: "CHANGE", payload: true });
          // setTotal(0);
          toast.success("Successfully sold.");
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  };
  return (
    <div>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-2">
          <h3>
            {langs[lang].total}: {total}$
          </h3>
          <button className="btn btn-primary" onClick={payPal}>
            PayPal
          </button>
        </div>
        {cart.length ? (
          <div className="row pb-3">
            {cart.length &&
              cart.map((item, index) => (
                <div key={index} className="col-lg-6 mb-2">
                  <div className="card shadow py-4 px-2 position-relative">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn shadow-none position-absolute py-1"
                      style={{ right: 0, top: 0 }}
                    >
                      &#x2715;
                    </button>
                    <div className="row">
                      <div className="col-6">
                        <img src={item.images.url} alt="" className="w-100" />
                      </div>
                      <div className="col-6">
                        <h2>{item.title}</h2>
                        <h3>
                          <b>{langs[lang].price}: </b>
                          {item.price}$
                        </h3>
                        <p>
                          <b>{langs[lang].description}: </b>
                          {item.description}
                        </p>
                        <p>
                          <b>{langs[lang].content}: </b>
                          {item.content}
                        </p>
                        <div className="btn-group">
                          <button className="btn btn-secondary px-3" onClick={() => dicriment(item._id)}>
                            -
                          </button>
                          <button className="btn btn-light">{item.quantity}</button>
                          <button className="btn btn-secondary px-3" onClick={() => incriment(item._id)}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <h1 className="text-center">{langs[lang].noData}</h1>
        )}
      </div>
    </div>
  );
}
