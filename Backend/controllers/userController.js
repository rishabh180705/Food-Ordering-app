import userModel from "../model/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator'; 
import dotenv from 'dotenv';
dotenv.config();

//login user



const loginUser= async(req,res)=>{
    try {
        const { email, password } = req.body;
        const lowerEmail = email.toLowerCase();
    
        // Validate input
        if (!lowerEmail || !password) {
          return res.json({ success: false, message: "All fields are required" });
        }
        if (!validator.isEmail(lowerEmail)) {
          return res.json({ success: false, message: "Invalid email" });
        }
    
        // Check if user exists
        const user = await userModel.findOne({ email: lowerEmail });
        if (!user) {
          return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
    
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
    
        // Generate token
        const token = jwt.sign(
          { id: user._id, email: user.email, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
    
        res.cookie("token", token);
        res.status(200).json({ success: true, message: "Login successful"});
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
}


//register user
const registerUser = async(req,res)=>{
    try {
        const { name, email, password } = req.body;
        const lowerEmail = email.toLowerCase();
    
        // Validate input
        if (!name || !lowerEmail || !password) {
          return res.json({ success: false, message: "All fields are required" });
        }
        if (!validator.isEmail(lowerEmail)) {
          return res.json({ success: false, message: "Invalid email" });
        }
    
        // Check if user already exists
        if(password.length<8) return res.json({ success: false, message: "Enter Strong Password" });
        const existingUser = await userModel.findOne({ lowerEmail });
        if (existingUser) {
          return res.status(400).json({ success: false, message: "User already exists" });
        }
    
        // Hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
    
        // Create user
        const newUser = new userModel({
          name,
          email:lowerEmail,
          password: hashedPassword
        });
        await newUser.save();
    
        // Generate token
        const token = jwt.sign({ id: newUser._id,email:newUser.email,name:newUser.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token);
        res.status(201).json({ success: true, message: "User registered successfully"});
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
}




export {loginUser, registerUser};