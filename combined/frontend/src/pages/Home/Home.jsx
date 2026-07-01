import React from 'react';
import { Search, Camera, Stethoscope, MapPin, ArrowRight } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      {/* Hero Welcome Section */}
      <section className="home-hero">
        <span className="home-hero__eyebrow">🐾 AI Pet Dashboard</span>
        <h1 className="home-hero__title">Chào mừng bạn quay trở lại, Pet Lover!</h1>
        <p className="home-hero__subtitle">
          Dựa trên nhật ký phân tích hành vi của bạn, hệ thống AI khuyến nghị bạn nên cập
          nhật lại chế độ dinh dưỡng mùa hè cho cún cưng của mình.
        </p>
        <button
          className="btn-primary btn-lg"
          onClick={() => onNavigate('nutrition')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6em' }}
        >
          Phân tích dinh dưỡng ngay <ArrowRight size="1.1em" />
        </button>
      </section>

      {/* Feature Grid */}
      <div className="feature-grid">

        {/* Breed Recommendation */}
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(116, 67, 54, 0.12)' }}>
            <Search size="50%" color="#744336" />
          </div>
          <span className="feature-tag" style={{ background: 'rgba(116, 67, 54, 0.12)', color: '#744336', alignSelf: 'flex-start' }}>
            AI SUGGESTION
          </span>
          <h3 className="feature-card__title" style={{ marginTop: 'var(--space-2)' }}>Tìm giống chó phù hợp</h3>
          <p className="feature-card__desc">
            Trả lời 5 câu hỏi nhanh về không gian sống và thời gian rảnh rỗi để AI tìm ra
            người bạn bốn chân hoàn hảo nhất cho bạn.
          </p>
          <div className="feature-card__spacer" />
          <button className="btn-secondary btn-lg" onClick={() => onNavigate('recommendation')}>
            Bắt đầu khảo sát
          </button>
        </div>

        {/* Image Gallery with AI Tagging */}
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(67, 137, 82, 0.12)' }}>
            <Camera size="50%" color="#438952" />
          </div>
          <span className="feature-tag" style={{ background: 'rgba(67, 137, 82, 0.12)', color: '#438952', alignSelf: 'flex-start' }}>
            AI TAGGING GALLERY
          </span>
          <h3 className="feature-card__title" style={{ marginTop: 'var(--space-2)' }}>Khoảnh khắc cún cưng</h3>
          <p className="feature-card__desc">
            Tải ảnh của bạn lên, AI tự động quét nhận diện trạng thái cảm xúc và sức khỏe da lông.
          </p>
          <div className="feature-tags">
            <span className="feature-tag" style={{ color: '#438952' }}>#Healthy</span>
            <span className="feature-tag" style={{ color: '#744336' }}>#Golden</span>
          </div>
          <div className="feature-card__spacer" />
          <button className="btn-secondary btn-lg" onClick={() => onNavigate('gallery')}>
            Tải lên kho ảnh
          </button>
        </div>

        {/* Emergency Vet Hub */}
        <div className="feature-card feature-card--alert">
          <div className="feature-icon" style={{ background: 'rgba(227, 68, 50, 0.1)' }}>
            <Stethoscope size="50%" color="#E34432" />
          </div>
          <span className="feature-tag" style={{ background: 'rgba(227, 68, 50, 0.1)', color: '#E34432', alignSelf: 'flex-start' }}>
            EMERGENCY HUB
          </span>
          <h3 className="feature-card__title" style={{ marginTop: 'var(--space-2)' }}>Cứu hộ thú y khẩn cấp</h3>
          <p className="feature-card__desc">
            Phát hiện 2 bệnh viện thú y mở cửa 24/7 gần vị trí của bạn hiện tại (Bán kính dưới 2km).
          </p>
          <div className="clinic-box">
            <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}>
              <MapPin size="1em" color="#E34432" /> Bệnh viện Thú y Quốc tế Pawcare
            </strong>
            <br />
            <span style={{ color: '#438952' }}>🟢 Đang mở cửa</span> • Cách bạn 1.2 km
          </div>
          <div className="feature-card__spacer" />
          <button className="btn-primary btn-lg" style={{ backgroundColor: '#E34432' }} onClick={() => onNavigate('vet')}>
            Gọi hỗ trợ khẩn cấp
          </button>
        </div>

      </div>
    </div>
  );
}
