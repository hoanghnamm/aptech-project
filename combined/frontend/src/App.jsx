import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import BreedRecognitionPage from './pages/BreedRecognition/BreedRecognitionPage';
import ChatbotPage from './pages/Chatbot/ChatbotPage';
import NutritionPage from './pages/Nutrition/NutritionPage';
import EncyclopediaPage from './pages/Encyclopedia/EncyclopediaPage';
import RecommendationPage from './pages/Recommendation/RecommendationPage';
import SearchPage from './pages/Search/SearchPage';
import VetAssistancePage from './pages/VetAssistance/VetAssistancePage';
import GalleryPage from './pages/Gallery/GalleryPage';
import InsightsPage from './pages/Insights/InsightsPage';
import { trackPageView } from './api/analytics.api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Visitor analytics: log every page view (session-based, anonymous)
  useEffect(() => {
    trackPageView(currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'identification':
        return <BreedRecognitionPage />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'encyclopedia':
        return <EncyclopediaPage />;
      case 'recommendation':
        return <RecommendationPage />;
      case 'search':
        return <SearchPage />;
      case 'vet':
        return <VetAssistancePage />;
      case 'gallery':
        return <GalleryPage />;
      case 'insights':
        return <InsightsPage onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <MainLayout onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </MainLayout>
  );
}