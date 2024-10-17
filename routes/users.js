const router = require("express").Router();
const { createUser, login, updateUser } = require("../controllers/users")

// Route to login
router.get("/signin", login);

// Route to create new user
router.post("/signup", createUser);

// Route to update user
router.patch("/me", updateUser);

module.exports = router;