const router = require("express").Router();
const { updateUser, getCurrentUser  } = require("../controllers/users");
const {validateUserBody} = require("../middlewares/validation")
const auth = require("../middlewares/auth");

// Route to update user
router.patch("/me", auth, validateUserBody,updateUser);

router.get("/me", auth, getCurrentUser);

module.exports = router;