const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/clothingItems")

// Route to get all the clothing items
router.get("/", getItems);

// Route to create a new clothing item
router.post("/", createItem);

// Route to delete a clothing item by ID
router.delete("/:itemId", deleteItem);

module.exports = router;