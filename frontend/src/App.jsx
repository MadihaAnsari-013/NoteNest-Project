// src/App.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import ParticlesBG from "./components/ParticlesBG";
import { NoteProvider } from "./context/NoteContext";

function App() {
  const location = useLocation();

  return (
    <NoteProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 overflow-hidden">
        <ParticlesBG />
        <div className="relative z-10">
          <Navbar />
          <main className="flex-1 container mx-auto p-4">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Createnote />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </div>
    </NoteProvider>
  );
}

export default App;