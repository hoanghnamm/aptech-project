import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Layout } from "./Layout";
import { BreedEncyclopedia } from "./pages/Encyclopedia/EncyclopediaPage";
import { BreedProfile } from "./pages/Encyclopedia/BreedProfile";
import { ImageAnalyzer } from "./pages/BreedRecognition/BreedRecognitionPage";
import NutritionPage from "./pages/Nutrition/NutritionPage";
import RecommendationPage from "./pages/Recommendation/RecommendationPage";
import VetAssistancePage from "./pages/VetAssistance/VetAssistancePage";
import ChatbotPage from "./pages/Chatbot/ChatbotPage";
import GalleryPage from "./pages/Gallery/GalleryPage";
import InsightsPage from "./pages/Insights/InsightsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BreedEncyclopedia />} />
          <Route path="/identify" element={<ImageAnalyzer />} />
          <Route path="/breeds/:breedId" element={<BreedProfile />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/vet" element={<VetAssistancePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export { App };
export default App;