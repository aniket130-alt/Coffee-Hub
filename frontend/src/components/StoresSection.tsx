import React from 'react';
import { MapPin, Phone, Clock, Store } from 'lucide-react';
import { Hub } from '../types';

interface StoresSectionProps {
  hubs: Hub[];
  onSelectStoreToOrder: (hubName: string) => void;
}

export const StoresSection: React.FC<StoresSectionProps> = ({ hubs, onSelectStoreToOrder }) => {
  const activeHubs = hubs.filter((h) => h.isActive);

  if (activeHubs.length === 0) return null;

  return (
    <section className="stores-section" id="stores" style={{ padding: '60px 20px', background: '#fffaf5' }}>
      <div className="section-container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <h2 className="section-title">
          Our <span>Coffee Stores & Hubs</span>
        </h2>
        <p className="section-subtitle">
          Visit our artisanal roastery cafes or select your nearest store for instant pickup, dine-in, or door delivery.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {activeHubs.map((hub) => (
            <div
              key={hub.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #f1e5dc',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <img
                src={
                  hub.imageUrl ||
                  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'
                }
                alt={hub.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Store size={18} color="var(--coffee-primary)" />
                  <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700, color: '#1a1a1a' }}>
                    {hub.name}
                  </h3>
                </div>

                <div style={{ fontSize: '14px', color: '#555', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={16} color="#888" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>
                    {hub.address}, {hub.city} - {hub.pincode}
                  </span>
                </div>

                {hub.phone && (
                  <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Phone size={14} color="#888" />
                    <span>{hub.phone}</span>
                  </div>
                )}

                {hub.hours && (
                  <div style={{ fontSize: '13px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Clock size={14} color="#166534" />
                    <span>{hub.hours}</span>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f5e9df' }}>
                  <button
                    className="checkout-btn"
                    style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '6px' }}
                    onClick={() => onSelectStoreToOrder(hub.name)}
                  >
                    Order from this Store
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
