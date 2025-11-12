// backend/routes/noteRoutes.js
import express from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/note.controller.js";
import sendEmail from "../utils/sendEmail.js"; // ← Import it
import Note from "../models/note.model.js"; // ← Import Note model

const router = express.Router();

router.post("/create-note", createNote);
router.get("/get-notes", getNotes);
router.put("/update-note/:id", updateNote);
router.delete("/delete-note/:id", deleteNote);

// SHARE ROUTE
router.post("/share/:id", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email required" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #8b5cf6;">${note.title}</h2>
        <p style="color: #555; line-height: 1.6;">${note.content.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Shared via <strong>NoteNest</strong></p>
      </div>
    `;

    await sendEmail(email, `Note: ${note.title}`, html); // ← Use dynamic email

    res.json({ message: "Note shared successfully!" });
  } catch (error) {
    console.error("Share error:", error);
    res.status(500).json({ message: "Email failed", error: error.message });
  }
});

export default router;