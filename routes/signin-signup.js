const router = require("express").Router();
const {createUser, login,} = require("../controllers/users");

// Route to login
router.post("/signin", login);

// Route to create new user
router.post("/signup", createUser);

module.exports = router;