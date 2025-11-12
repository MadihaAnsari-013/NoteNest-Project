// src/pages/Home.jsx
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import Notecard from "../components/Notecard";
import { motion } from "framer-motion";
import { FileText, Mail, X } from "lucide-react";
import BACKEND_URL from "../api/url";

export default function Home() {
  const { notes, loading } = useContext(NoteContext);

  // SHARE MODAL STATE
  const [shareModal, setShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareNoteId, setShareNoteId] = useState("");

  // SEARCH STATE
  const [search, setSearch] = useState("");

  // SHARE HANDLER
  const handleShare = (id) => {
    setShareNoteId(id);
    setShareEmail("");
    setShareModal(true);
  };

  const submitShare = async () => {
    if (!shareEmail || !shareEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    try {
      await BACKEND_URL.post(`/share/${shareNoteId}`, { email: shareEmail });
      alert("Note shared successfully!");
      setShareModal(false);
      setShareEmail("");
    } catch (err) {
      alert("Failed to share note.");
      console.error(err);
    }
  };

  // HELPER: Check if two dates are the same day
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // GROUP NOTES BY DATE
  const groupNotesByDate = (notes) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notes.forEach((note) => {
      const noteDate = new Date(note.createdAt);
      let key;

      if (isSameDay(noteDate, today)) {
        key = "Today";
      } else if (isSameDay(noteDate, yesterday)) {
        key = "Yesterday";
      } else {
        key = noteDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    });

    return groups;
  };

  // FILTER NOTES BY SEARCH
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6"
        >
          <FileText size={80} className="text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">No Notes Yet</h3>
        <p className="text-gray-400 mb-6">Start by creating your first note!</p>
        <a
          href="/create"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition"
        >
          Create Note
        </a>
      </motion.div>
    );
  }

  return (
    <>
      {/* SEARCH BAR */}
      <div className="p-4 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-xl 
                       border border-white/20 text-white placeholder-white/50 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       transition-all duration-300"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* GROUPED NOTES BY DATE */}
      <div className="p-4 space-y-8">
        {Object.entries(groupNotesByDate(filteredNotes)).map(([date, dateNotes]) => (
          <div key={date} className="space-y-4">
            {/* Date Label */}
            <h2 className="text-lg font-semibold text-purple-400 dark:text-purple-300 
                           px-2 border-l-4 border-purple-500">
              {date} {search && `(${dateNotes.length} found)`}
            </h2>

            {/* Notes Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dateNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Notecard note={note} onShare={handleShare} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* NO RESULTS */}
        {search && Object.keys(groupNotesByDate(filteredNotes)).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No notes found for "<span className="text-purple-400">{search}</span>"
            </p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                <Mail className="w-6 h-6 text-purple-500" />
                Share Note
              </h3>
              <button
                onClick={() => setShareModal(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="email"
              placeholder="student@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />

            <button
              onClick={submitShare}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white 
                         rounded-xl font-medium hover:scale-105 transition transform"
            >
              Send Email
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}