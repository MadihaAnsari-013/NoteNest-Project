// src/components/Notecard.jsx
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { Edit2, Trash2, Save, X, Mail, Download } from "lucide-react";
import confetti from "canvas-confetti";
import html2pdf from "html2pdf.js";

export default function Notecard({ note, onShare }) {
  const { deleteNote, updateNote } = useContext(NoteContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: note.title, content: note.content });

  const handleSave = () => {
    updateNote(note._id, editData);
    setIsEditing(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#3b82f6", "#06b6d4"],
    });
  };

  const exportToPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; background: white; color: black;">
        <h1 style="color: #8b5cf6; margin-bottom: 20px; font-size: 28px;">${note.title}</h1>
        <p style="white-space: pre-wrap; line-height: 1.8; font-size: 16px;">${note.content}</p>
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">Exported from <strong>NoteNest</strong> • ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    html2pdf()
      .set({
        margin: 1,
        filename: `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      })
      .from(element)
      .save();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="group relative"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="bg-glass backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-medium">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-600 rounded-xl text-white">
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white mb-2">{note.title}</h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{note.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg"
                  title="Edit"
                >
                  <Edit2 size={16} className="text-purple-400" />
                </button>
                <button
                  onClick={() => onShare(note._id)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg"
                  title="Share via Email"
                >
                  <Mail size={16} className="text-blue-400" />
                </button>
                <button
                  onClick={exportToPDF}
                  className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg"
                  title="Export to PDF"
                >
                  <Download size={16} className="text-green-400" />
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}