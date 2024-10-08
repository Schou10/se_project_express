const router = require("express").Router();

router.get("/", ()=>{
  console.log("GET users");
})
router.get("/:userId", ()=>{
  console.log("GET users by _id");
})
router.post("/", ()=>{
  console.log("POST user");
})

module.exports = router;