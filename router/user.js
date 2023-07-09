const express = require('express');
const userController = require('../controller/user');
const router = express.Router();

router.post("/user", userController.create)
router.delete("/user/:id", userController.delete)


module.exports = router