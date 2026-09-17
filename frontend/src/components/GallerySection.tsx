import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { X, ZoomIn } from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <section className="gallery-section" id="gallary">
      <div className="gallery-container">
        <h2 className="section-title">
          Our <span>Gallery</span>
        </h2>
        <p className="section-subtitle">
          Moments captured around our roastery, coffee craft, and cozy corner ambience.
        </p>

        <div className="gallery-grid">
          {items.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => setSelectedImage(item)}
            >
              <img src={item.imageUrl} alt={item.title} />
              <div className="gallery-item-hover">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <ZoomIn size={24} />
                  <span>{item.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '90%',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
            />
            <div style={{ padding: '16px 24px', color: 'white', backgroundColor: '#111' }}>
              <h4 style={{ fontSize: '18px', color: '#b2744c' }}>{selectedImage.title}</h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
