import React from 'react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings: SiteSettings;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  // Parse heading to highlight second word or "Us"
  const headingText = settings.aboutHeading || "About Us";
  const parts = headingText.split(' ');
  const mainPart = parts.slice(0, -1).join(' ');
  const spanPart = parts.length > 1 ? parts[parts.length - 1] : '';

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <h2 className="section-title">
          {mainPart} {spanPart ? <span>{spanPart}</span> : null}
        </h2>

        <div className="about-grid">
          <div className="about-image-wrapper">
            <img
              src={
                settings.aboutImageUrl ||
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80'
              }
              alt="About Our Coffee"
            />
          </div>

          <div className="about-content">
            <h2>{settings.aboutSubheading || "What Makes Our Coffee Special?"}</h2>
            {settings.aboutStory1 && <p>{settings.aboutStory1}</p>}
            {settings.aboutStory2 && <p>{settings.aboutStory2}</p>}
            {settings.aboutStory3 && <p>{settings.aboutStory3}</p>}
            <button className="about-btn" onClick={() => {
              const el = document.getElementById('menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              {settings.aboutBtnText || "Learn More"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
