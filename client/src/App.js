import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import DetailProduct from "./components/products/DetailProduct";
import Productes from "./components/products/Productes";
import { ToastContainer } from "react-toastify";
import Cart from "./components/products/Cart";
import History from "./components/history/History";
import NotFound from "./components/NotFound";
import HistoryDetail from "./components/history/HistoryDetail";
import Categories from "./components/categories/Categories";
import CreateProduct from "./components/products/CreateProduct";

function App() {
  const { loading } = useSelector(state => state);
  const { auth } = useSelector(state => state);
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      const firstlogin = localStorage.getItem("firstlogin");
      if (firstlogin) {
        const res = await axios.get("/user/refresh_token");
        dispatch({ type: "AUTH", payload: res.data });
        dispatch({ type: "ADD_TO_CART", payload: res.data.user.cart });
        if (res.data.user.role === 1) {
          dispatch({ type: "ADMIN", payload: true });
        }
      }
    };
    fetch();
  }, [dispatch]);
  return (
    <div>
      <Navbar />
      {loading && <Loading />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Productes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detail/:id" element={<DetailProduct />} />
        
        <Route path="/cart" element={<Cart />} />


        {auth.accessToken ? (
          <>
            <Route path="/history" element={<History />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/create_product" element={<CreateProduct />} />
            <Route path="/edit_product/:id" element={<CreateProduct />} />
            <Route path="/history/:id" element={<HistoryDetail />} />
          </>
        ) : (
          ""
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
