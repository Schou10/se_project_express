const router = require("express").Router();
const { err404 } = require("../utils/errors");
const  clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const loginSignupRouter = require("./signin-signup");
const { NotFoundError } = require("../errors/notfounderror");

// Item base route /items
router.use("/items", clothingItemRouter);

// User base rooute /users
router.use("/users", userRouter);

// Login-Signup
router.use("", loginSignupRouter);

// Route response if route is invalid
router.use(() => {
  throw new NotFoundError(err404.message)
});

module.exports = router;