import React, { useState } from 'react';
import { Lock, User, Coffee, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        sessionStorage.setItem('admin_token', res.token);
        onLoginSuccess();
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f5f2',
        padding: '20px',
        backgroundImage: 'radial-gradient(#e6ded6 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          border: '1px solid #ede8e3',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            backgroundColor: '#1e1e2d',
            padding: '36px 30px 28px 30px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#b2744c',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 4px 12px rgba(178, 116, 76, 0.4)',
            }}
          >
            <Coffee size={28} color="white" />
          </div>
          <h2
            style={{
              fontSize: '22px',
              fontFamily: "'Merriweather', serif",
              fontWeight: 700,
              margin: '0 0 6px 0',
              color: '#ffffff',
            }}
          >
            Coffee Shop Admin
          </h2>
          <p style={{ color: '#a0a3bd', fontSize: '13px', margin: 0 }}>
            Sign in to manage images, prices, logo, and website content
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '30px' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                borderLeft: '4px solid #ef4444',
                color: '#991b1b',
                padding: '12px 14px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '6px',
                }}
              >
                Username
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '0 12px',
                  backgroundColor: '#f9fafb',
                }}
              >
                <User size={18} color="#9ca3af" />
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 10px',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#4b5563',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '0 12px',
                  backgroundColor: '#f9fafb',
                }}
              >
                <Lock size={18} color="#9ca3af" />
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 10px',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#b2744c',
                color: 'white',
                border: 'none',
                padding: '13px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          {/* Helper Credentials Box */}
          <div
            style={{
              marginTop: '22px',
              padding: '12px',
              backgroundColor: '#fffaf5',
              border: '1px dashed #b2744c',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#8c5634',
            }}
          >
            <strong>Default Credentials:</strong> username <code>admin</code> &bull; password <code>admin123</code>
          </div>

          {/* Return link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={onBackToSite}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={14} /> Return to Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
