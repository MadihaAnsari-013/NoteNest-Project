// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import noteRoutes from './routes/note.route.js'; // <-- WAS "noteRoutes" → "noteRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001; // <-- Use 4001

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/noteapp", noteRoutes); // Correct path

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB"); // Fixed typo
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });