import React from 'react';
import { SiteSettings } from '../types';
import { ChevronUp } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer id="footer" className="site-footer">
        <div className="footer-container">
          {/* Logo */}
          <div className="footer-logo">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.siteName || "Coffee Shop"} />
            ) : (
              <h2 style={{ color: 'white', marginBottom: '15px' }}>☕ {settings.siteName || "Coffee Shop"}</h2>
            )}
          </div>

          {/* Social Links */}
          <div className="social-icons-row">
            {settings.socialTwitter && (
              <a
                href={settings.socialTwitter}
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Twitter / X"
              >
                𝕏
              </a>
            )}
            {settings.socialFacebook && (
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Facebook"
              >
                f
              </a>
            )}
            {settings.socialInstagram && (
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Instagram"
              >
                ig
              </a>
            )}
            {settings.socialYoutube && (
              <a
                href={settings.socialYoutube}
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="YouTube"
              >
                yt
              </a>
            )}
            {settings.socialPinterest && (
              <a
                href={settings.socialPinterest}
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Pinterest"
              >
                p
              </a>
            )}
          </div>

          {/* Credits */}
          <div className="footer-credit">
            Designed By{' '}
            <a href={settings.footerCreditLink || '#'}>
              {settings.footerCreditName || 'Aniket'}
            </a>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            {settings.copyrightText || '© Copyright Coffee Shop. All Rights Reserved'}
          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      <button className="scroll-top-btn" onClick={scrollToTop} title="Back to top">
        <ChevronUp size={24} />
      </button>
    </>
  );
};
