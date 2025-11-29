// src/pages/Createnote.jsx
import { useState, useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import BACKEND_URL from "../api/url";

export default function Createnote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { fetchNotes } = useContext(NoteContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await BACKEND_URL.post("/create-note", { title, content });
      await fetchNotes();
      navigate("/");
    } catch (err) {
      alert("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 flex flex-col items-center justify-start p-6 pt-16">
      <div className="w-full max-w-lg">

        {/* BACK TO NOTES BUTTON — CLEAR & BEAUTIFUL */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition font-medium text-lg"
        >
          <ArrowLeft size={26} />
          Back to Notes
        </button>

        {/* ULTRA-COMPACT CREATE CARD */}
        <div className="glass p-7 rounded-3xl border border-cyan-500/30 shadow-2xl">
          <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center">
            New Note
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-cyan-500/40 
                         text-cyan-100 placeholder-cyan-300/60 text-lg font-medium
                         focus:outline-none focus:ring-4 focus:ring-cyan-500/60 
                         transition-all"
              required
            />

            {/* Content — Only 6 lines */}
            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-5 py-4 rounded-xl bg-black/50 border border-cyan-500/40 
                         text-cyan-100 placeholder-cyan-300/60 resize-none text-base
                         focus:outline-none focus:ring-4 focus:ring-cyan-500/60 
                         transition-all leading-snug"
              required
            />

            {/* SAVE BUTTON — ALWAYS VISIBLE */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 
                         text-white text-lg font-bold rounded-xl 
                         shadow-lg shadow-cyan-500/60 
                         hover:shadow-cyan-400/80 transform hover:scale-105 
                         transition-all duration-300 disabled:opacity-70 
                         flex items-center justify-center gap-2.5"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Plus size={26} />
                  Save Note
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}