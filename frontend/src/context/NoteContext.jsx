// src/context/NoteContext.jsx
import { createContext, useEffect, useState } from "react";
import BACKEND_URL from "../api/url";

export const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await BACKEND_URL.get("/get-notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addNote = async (note) => {
    try {
      const res = await BACKEND_URL.post("/create-note", note);
      setNotes([res.data, ...notes]);
    } catch (error) {
      console.error("Add note failed:", error);
    }
  };

  const updateNote = async (id, updates) => {
    try {
      const res = await BACKEND_URL.put(`/update-note/${id}`, updates);
      setNotes(notes.map(n => n._id === id ? res.data : n));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await BACKEND_URL.delete(`/delete-note/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const togglePin = async (id, currentPinned) => {
    try {
      await BACKEND_URL.patch(`/pin-note/${id}`, { pinned: !currentPinned });
      setNotes(notes.map(n => n._id === id ? { ...n, pinned: !currentPinned } : n));
    } catch (error) {
      console.error("Pin toggle failed:", error);
    }
  };

  return (
    <NoteContext.Provider value={{
      notes,
      loading,
      darkMode,
      setDarkMode,
      addNote,
      updateNote,
      deleteNote,
      togglePin,
      fetchNotes   // THIS IS NOW INCLUDED!
    }}>
      {children}
    </NoteContext.Provider>
  );
}