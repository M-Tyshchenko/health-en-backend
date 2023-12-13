const express = require("express");
require('./db')

const UserController = require("../../controllers/auth");

const { authenticate } = require("../../middlewares");

const jsonParser = express.json();

const router = express.Router();

router.post("/signup", jsonParser, UserController.register);

router.post("/signin", jsonParser, UserController.login);

router.get("/current", authenticate, UserController.current);

router.post("/forgot-password", jsonParser, UserController.forgotPsw);

router.post("/signout", authenticate, UserController.logout);



module.exports = router;
