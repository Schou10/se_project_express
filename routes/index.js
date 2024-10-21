const router = require("express").Router();
const { err404 } = require("../utils/errors");
const  clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const loginSignupRouter = require("./signin-signup");

// Item base route /items
router.use("/items", clothingItemRouter);

// User base rooute /users
router.use("/users", userRouter);

// Login-Signup
router.use("", loginSignupRouter);

// Route response if route is invalid
router.use((req, res) => {
  res.status(err404.status).send({message: "Route not found"});
});

module.exports = router;