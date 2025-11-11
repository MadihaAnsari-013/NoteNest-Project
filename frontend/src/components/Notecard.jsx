// src/components/Notecard.jsx
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { Edit2, Trash2, Save, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function Notecard({ note }) {
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

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="group relative"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="bg-glass backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
        {isEditing ? (
          // Edit mode...
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
                >
                  <Edit2 size={16} className="text-purple-400" />
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg"
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