const router = require("express").Router();
const { err400 } = require("../utils/errors");
const  clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

// Item base route /items
router.use("/items", clothingItemRouter);

// User base rooute /users
router.use("/users", userRouter);

// Route response if route is invalid
router.use((req, res) => {
  res.status(err400).send({message: "Route not found"});
});

module.exports = router;