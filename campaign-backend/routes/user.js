const router = require('express').Router();
const userController = require("../controller/userController");

router.post("/create", userController.postAddUser);
router.post("/login", userController.postLogin);

module.exports = router;