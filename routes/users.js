const router = require("express").Router();
const { updateUser, getCurrentUser  } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Route to update user
router.patch("/me", auth, updateUser);

router.get("/me", auth, getCurrentUser)

module.exports = router;