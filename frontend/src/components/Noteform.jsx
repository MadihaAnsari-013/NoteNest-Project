// src/components/Noteform.jsx
// src/components/Noteform.jsx
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { motion } from "framer-motion";

export default function Noteform() {
  const { createNote } = useContext(NoteContext);
  const [note, setNote] = useState({ title: "", content: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.title || !note.content) return;
    createNote(note);
    setNote({ title: "", content: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">Create Note</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="peer w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Title"
            />
            <label className="absolute left-4 -top-2.5 bg-gray-900 px-2 text-sm text-blue-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
              Title
            </label>
          </div>

          <div className="relative">
            <textarea
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              rows={5}
              className="peer w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition"
              placeholder="Content"
            />
            <label className="absolute left-4 -top-2.5 bg-gray-900 px-2 text-sm text-blue-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
              Content
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200"
          >
            Add Note
          </button>
        </form>
      </div>
    </motion.div>
  );
}