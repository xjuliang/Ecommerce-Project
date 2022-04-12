import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Search from "../SearchBar/Search";
import AdminDropdown from "./adminDropdown/AdminDropdown";
import { Routes, Link, Route } from "react-router-dom";
import { resetFilterProducts } from "../../redux/actions/filterByCategory";
import { State } from "../../redux/reducers";
import { getProducts,productNotFound,resetPoducts,} from "../../redux/actions/products";
import { deleteProductDetail } from "../../redux/actions/productDetail";
import UserDropdown from "./userDropdown/UserDropdown";
import CartIcon from "./cartIcon/CartIcon";
import { setPage } from "../../redux/actions/setPage";
import {NavBar} from "./NavStyles"

const Nav = (): JSX.Element => {
  const dispatch = useDispatch();
  const userState = useSelector((state: State) => state.user);
  const page = useSelector((state: State) => state.page);
  // const [userInStorage, setuserInStorage] = useLocalStorage("USER_LOGGED", "");

  function handleClickLogIn() {
    dispatch(setPage(0));
  }

  function handleClickProducts() {
    dispatch(productNotFound(false));
    dispatch(resetFilterProducts());
    dispatch(resetPoducts());
    dispatch(deleteProductDetail());
    dispatch(getProducts());
    // dispatch(resetPoducts())
  }

  return (
    <NavBar className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top p-3">
      <div className="flex-grow-1 d-lg-flex align-items-center">
        <Link className="navbar-brand " to="/home">
          PCSHOP
        </Link>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <div className="navbar-nav me-auto">
            <div className="nav-item">
              <Link
                onClick={() => {
                  handleClickProducts();
                }}
                className="nav-link"
                to={"/products"}
              >
                Products
              </Link>
            </div>
            <div className="nav-item">
              <Link className="nav-link" to={"/products"}>
                About
              </Link>
            </div>
          </div>
          <Routes>
            <Route path="/products" element={<Search />} />
            <Route path="/adminMode" element={<Search />} />
          </Routes>
          <div className="me-5">
            {userState && userState.role === "admin" && <AdminDropdown />}
            {userState && userState.role === "user" && <UserDropdown />}
            {!userState && page === 0 ? (
              <Link
                to="/login"
                className="nav-item btn btn-secondary my-2 link-Router"
                onClick={() => {
                  handleClickLogIn();
                }}
              >
                Login
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="ms-auto mb-auto py-lg-3">
        <Routes>
          <Route path="/products" element={<CartIcon />} />
          <Route path="/cart" element={<CartIcon />} />
          <Route path="/detail/:id" element={<CartIcon />} />
        </Routes>
        <button
          className="navbar-toggler nav-item"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </NavBar>
  );
};

export default Nav;
