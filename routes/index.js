const express = require("express");
const controllers = require("../controllers/");
const middlewares = require("../middlewares/");

const routes = function () {
  const apiRoute = express.Router();
  const userController = controllers.userController();
  apiRoute.route("/user/register").post(userController.register);
  apiRoute.route("/user/login").post(userController.login);
  apiRoute.route("/user/logout").post(userController.logout);

  apiRoute.use(middlewares.authMiddleWare);
  apiRoute.route("/users").get(userController.getAllUser);
  apiRoute
    .route("/user/:id")
    .delete(userController.deleteUser)
    .put(userController.updateUser)
    .get(userController.getUser);

  return apiRoute;
};

module.exports = routes;
