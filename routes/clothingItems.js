const router = require("express").Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem, updateItem  } = require("../controllers/clothingItems");

// Route to get all the clothing items
router.get("/", getItems);

// Route to create a new clothing item
router.post("/", createItem);

// Route to delete a clothing item by ID
router.delete("/:itemId", deleteItem);

// Route to update Item
router.put("/:itemId", updateItem )


// Route to like a clothing item
router.put('/:itemId/likes', likeItem);

// Route to dislike a clothing item
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;