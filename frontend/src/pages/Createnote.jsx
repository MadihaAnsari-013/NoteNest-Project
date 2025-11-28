// src/pages/Createnote.jsx
import { useState, useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../api/url";
import { ArrowLeft } from "lucide-react";

export default function Createnote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { addNote, fetchNotes } = useContext(NoteContext); // fetchNotes is key!
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const newNote = { title, content, createdAt: new Date() };
      await BACKEND_URL.post("/create-note", newNote);

      // THIS LINE FIXES EVERYTHING
      await fetchNotes(); // Re-fetch all notes from backend

      navigate("/"); // Go back to home → note appears instantly!
    } catch (error) {
      alert("Failed to save note. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition"
        >
          <ArrowLeft size={24} />
          Back to Notes
        </button>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Create New Note</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Note Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/50 text-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/50 resize-none focus:ring-4 focus:ring-purple-500/50 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-pink-500/50 transform hover:scale-105 transition disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}