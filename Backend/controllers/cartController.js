import userModel from "../model/userModel.js";

// Add item to cart
const AddToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {}; // Initialize cartData if it doesn’t exist

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// Remove item from cart
const RemoveFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] <= 0) {
        delete cartData[req.body.itemId]; // Remove item if quantity is zero
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {}; // Ensure cartData is returned even if empty
    res.json({ success: true, cartData });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching cart data" });
  }
};

export { AddToCart, RemoveFromCart, getCart };
