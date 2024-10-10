const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users")

// Route to get all users
router.get("/", getUsers);

// Route to get user by  ID
router.get("/:userId", getUser);

// Route to create new user
router.post("/", createUser);

module.exports = router;