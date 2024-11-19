import foodModel from "../model/foodSchema.js";
import fs from 'fs';
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.cloudinary_cloud_name, 
    api_key: process.env.cloudinary_api_key, 
    api_secret: process.env.cloudinary_api_secret,
});


// Add Food Item
const addFood = async (req, res) => {
    let uploadResult;    
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload Image to Cloudinary
    try {
        uploadResult = await cloudinary.uploader.upload(req.file.path);
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return res.status(500).json({ success: false, message: "Image upload failed" });
    }
    
    // Create a New Food Item
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: uploadResult.secure_url,
        veg:req.body.veg,
    });

    try {
        await food.save();

        // Remove local file after successful save
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
            else console.log("Successfully deleted local file after upload");
        });

        res.status(201).json({ success: true, message: "Food added successfully" });
    } catch (error) {
        console.error("Error saving food to the database:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

// all food list
const listFood= async (req,res) => {
    try {
        const foods=await foodModel.find({});
        res.json({ success: true, data:foods });
    } catch (error) {
        console.log("Error getting food list from the database:", error);
        res.json({ success: false, message: "Database error" });

    }
}

//remove food
const removeFood = async (req, res) => {
    try {
        // Find the food item by ID
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Extract the public ID of the image from the food item
        const publicId = food.image.split('/').pop().split('.')[0]; // Assuming food.image is a URL

        // Delete the image from Cloudinary
        const deletionResult = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Deletion Result:", deletionResult);

        // Delete the food item from the database
        await foodModel.findByIdAndDelete(req.body.id);

        res.status(200).json({ success: true, message: "Food item deleted successfully" });
    } catch (error) {
        console.error("Error removing food item:", error);
        res.status(500).json({ success: false, message: "Error deleting food item" });
    }
};

// stock Management
const manageStock = async (req, res) => {
    // console.log("Stock Management");
    // console.log(req.body.id);
    
    try {
      // Validate request body for the food ID
        // Find the food item by ID
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }
  
      // Find the food item by ID
      const foodItem = await foodModel.findById(req.body.id);
      if (!foodItem) {
        return res.status(404).json({ success: false, message: "Food item not found" });
      }
  
      // Toggle the Availability status
      foodItem.Availability = !foodItem.Availability;
  
      // Save the updated food item
      await foodItem.save();
  
      // Send success response
      res.status(200).json({
        success: true,
        message: `Stock status updated successfully. Stock is now ${foodItem.Availability ? "Available" : "Out of Stock"}.`,
        data: foodItem,
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
export { addFood ,listFood,removeFood,manageStock };
