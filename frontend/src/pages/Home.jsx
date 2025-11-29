// src/pages/Home.jsx
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import Notecard from "../components/Notecard";
import { motion } from "framer-motion";
import { FileText, Mail, X, Plus } from "lucide-react";
import BACKEND_URL from "../api/url";

export default function Home() {
  const { notes, loading } = useContext(NoteContext);

  // Share Modal
  const [shareModal, setShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareNoteId, setShareNoteId] = useState("");

  // Search
  const [search, setSearch] = useState("");

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
    }
  };

  // Date Grouping
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const groupNotesByDate = (notes) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notes.forEach((note) => {
      const noteDate = new Date(note.createdAt);
      let key;
      if (isSameDay(noteDate, today)) key = "Today";
      else if (isSameDay(noteDate, yesterday)) key = "Yesterday";
      else
        key = noteDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    });
    return groups;
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass p-6 rounded-2xl animate-pulse">
            <div className="h-7 bg-cyan-500/20 rounded mb-4"></div>
            <div className="h-4 bg-cyan-500/10 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-cyan-500/10 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-10"
        >
          <FileText size={120} className="text-cyan-400" />
        </motion.div>
        <h2 className="text-5xl font-bold text-cyan-300 mb-4">Welcome to NoteNest</h2>
        <p className="text-xl text-cyan-200 mb-10">Your digital mind, beautifully organized.</p>
        <a
          href="/create"
          className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/80 transform hover:scale-110 transition"
        >
          Create Your First Note
        </a>
      </motion.div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="p-6 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-5 pr-16 rounded-2xl bg-black/50 border border-cyan-500/40 text-cyan-100 placeholder-cyan-300/60 focus:outline-none focus:ring-4 focus:ring-cyan-500/60 transition-all"
          />
          <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="px-6 pb-32">
        {Object.entries(groupNotesByDate(filteredNotes)).map(([date, dateNotes]) => (
          <div key={date} className="mb-14">
            <h2 className="text-2xl font-bold text-cyan-400 mb-8 px-3 border-l-4 border-cyan-500">
              {date}
              {search && <span className="text-cyan-200 text-lg ml-4">({dateNotes.length} found)</span>}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {dateNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Notecard note={note} onShare={handleShare} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {search && filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl text-cyan-300">
              No notes found for "<span className="text-white font-bold">{search}</span>"
            </p>
          </div>
        )}
      </div>

      {/* FLOATING ADD BUTTON - GLOWING CYBER BLUE */}
      <div className="fixed bottom-10 right-10 z-50">
        <a
          href="/create"
          className="group flex h-16 w-16 items-center justify-center rounded-full 
                     bg-gradient-to-br from-cyan-400 to-blue-700 
                     shadow-2xl shadow-cyan-500/60 
                     hover:shadow-cyan-400/80 
                     transform hover:scale-110 hover:rotate-90 
                     transition-all duration-500"
        >
          <Plus className="h-9 w-9 text-white" />
        </a>
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-8 rounded-3xl shadow-2xl w-full max-w-md border border-cyan-500/40"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-cyan-300">
                <Mail className="w-8 h-8" />
                Share Note
              </h3>
              <button onClick={() => setShareModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-7 h-7 text-cyan-300" />
              </button>
            </div>
            <input
              type="email"
              placeholder="friend@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-black/60 border border-cyan-500/50 text-cyan-100 placeholder-cyan-300/70 focus:outline-none focus:ring-4 focus:ring-cyan-500/60 mb-6"
            />
            <button
              onClick={submitShare}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/60 transform hover:scale-105 transition"
            >
              Send Email
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}