import React from 'react';
import reactLogo from '../../assets/react.svg';
import viteLogo from '../../assets/vite.svg';
import heroImg from '../../assets/hero.png';
import './Hero.css';

export default function Hero({ count, onIncrement }) {
  return (
    <section className="hero-section">
      <div className="hero-visuals">
        <img src={heroImg} className="base-img" width="170" height="179" alt="Background base" />
        <img src={reactLogo} className="logo-react" alt="React logo" />
        <img src={viteLogo} className="logo-vite" alt="Vite logo" />
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">Component Test Lab</h1>
        <p className="hero-subtitle">
          A sandbox interface to test and play with popular, modern React components.
        </p>
      </div>

      <div className="hero-interactive">
        <button
          type="button"
          className="interactive-counter"
          onClick={onIncrement}
        >
          Increment Global Counter: <strong>{count}</strong>
        </button>
      </div>
    </section>
  );
}
