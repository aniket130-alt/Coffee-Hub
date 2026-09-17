import React from 'react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section
      id="home"
      className="hero-section"
      style={{
        backgroundImage: `url(${settings.heroImageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=80'})`,
      }}
    >
      <div className="hero-overlay" />
      <div className="hero-container">
        <div className="hero-content">
          <h1>{settings.heroHeading || "Start Your Day With a\nFresh Coffee"}</h1>
          <p>
            {settings.heroSubheading ||
              "Experience artisanal coffee brewed to perfection from hand-selected beans sourced across the world."}
          </p>
          <a href={settings.heroBtnLink || "#menu"} className="hero-btn">
            {settings.heroBtnText || "Shop Now"}
          </a>
        </div>
      </div>
    </section>
  );
};
