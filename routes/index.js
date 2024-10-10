const router = require("express").Router();
const  clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(500).send({message: "Router not found"});
});

module.exports = router;