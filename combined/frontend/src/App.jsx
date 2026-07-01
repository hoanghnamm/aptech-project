import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import { BreedEncyclopedia } from "./pages/BreedEncyclopedia";
import { BreedProfile } from "./pages/BreedProfile";
import { ImageAnalyzer } from "./pages/ImageAnalyzer";
import Recommendation from "./pages/Recommendation";
import SmartSearch from "./pages/SmartSearch";
import Chatbot from "./pages/Chatbot";
import Nutrition from "./pages/Nutrition";
import Gallery from "./pages/Gallery";
import VetAssistance from "./pages/VetAssistance";
import Insights from "./pages/Insights";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encyclopedia" element={<BreedEncyclopedia />} />
        <Route path="/breeds/:breedId" element={<BreedProfile />} />
        <Route path="/identify" element={<ImageAnalyzer />} />
        <Route path="/recommend" element={<Recommendation />} />
        <Route path="/search" element={<SmartSearch />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/vets" element={<VetAssistance />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export { App };
export default App;
