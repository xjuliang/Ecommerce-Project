const express = require("express");
const {
  getOrders,
  createOrder,
  getActiveOrder,
  updateOrderState,
  getUserOrdersServer,
  addProductsOrder,
  removeProductsOrder,
  deleteProductsOrder,
  getUserOrders,
  updatePaypalOrder,
} = require("../controllers/order");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

//Creating routes and adding the controllers.

const orderRouter = express.Router();

//user
orderRouter.post("/auth/orders", isLoggedIn, createOrder); //a new product is added to the cart here

orderRouter.put("/admin/orders/:id", isLoggedIn, isAdmin, updateOrderState);
orderRouter.get("/auth/orders/user", isLoggedIn, getUserOrdersServer);
orderRouter.put("/auth/orders/add", isLoggedIn, addProductsOrder); // add one more existing product +
orderRouter.put("/auth/orders/remove", isLoggedIn, removeProductsOrder); //remove one more existing product -
orderRouter.delete("/auth/orders/delete", isLoggedIn, deleteProductsOrder);
orderRouter.get("/auth/orders", isLoggedIn, getActiveOrder);
orderRouter.put("/auth/:id/pay", isLoggedIn, updatePaypalOrder);

//admin
orderRouter.get("/admin/orders", isLoggedIn, isAdmin, getOrders);
// orderRouter.get("/admin/orders/:id", isLoggedIn, isAdmin, getUserOrders); terminar esta funcion luego.

module.exports = orderRouter;
