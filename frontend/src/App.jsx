import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// 1. Import trang Identify vào đây (Đảm bảo đúng đường dẫn thư mục của bạn)
import { BreedEncyclopedia } from "./pages/BreedEncyclopedia";
import { BreedProfile } from "./pages/BreedProfile";
import {ImageAnalyzer} from "./pages/ImageAnalyzer"; // Thêm dòng này

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ mặc định sẽ là Bách khoa toàn thư */}
        <Route path="/" element={<BreedEncyclopedia />} />

        {/* 2. Thêm Tuyến đường này cho trang Nhận diện AI */}
        <Route path="/identify" element={<ImageAnalyzer />} />

        {/* Trang Chi tiết Hồ sơ - :breedId là biến động */}
        <Route path="/breeds/:breedId" element={<BreedProfile />} />

        {/* Bắt lỗi 404 - Nếu người dùng gõ link bậy, đẩy về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export { App };
