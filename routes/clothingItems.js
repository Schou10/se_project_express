const router = require("express").Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem  } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

// Route to get all the clothing items
router.get("/", getItems);

// Route to create a new clothing item
router.post("/", auth ,createItem);

// Route to delete a clothing item by ID
router.delete("/:itemId", auth, deleteItem);

// Route to like a clothing item
router.put('/:itemId/likes', auth, likeItem);

// Route to dislike a clothing item
router.delete('/:itemId/likes', auth, dislikeItem);

module.exports = router;