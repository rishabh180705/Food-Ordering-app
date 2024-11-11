
import path from 'path';
import app from './src/app.js';
import { connectDB } from './database/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;


const DB_url = `${process.env.mongo_DB}/tomato`;

app.get('/', (req,res) => {  
    res.end("server is working");
})


connectDB(DB_url)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!", err);
  });

