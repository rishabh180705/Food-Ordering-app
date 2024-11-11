import express from 'express';
import { addFood,listFood ,removeFood} from '../controllers/foodController.js';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const foodRouter = express.Router();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Multer storage with correct destination path
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../uploads");
        console.log("Upload path:", uploadPath);  // Check if the path is correct
        cb(null, uploadPath);
    },
    
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

foodRouter.post('/add', upload.single('image'), addFood);

foodRouter.get('/list',listFood);
foodRouter.delete('/remove',removeFood);

export default foodRouter;
