import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Lock, Phone, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { User, SavedAddress } from '../types';
import { api } from '../services/api';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserLogin: (user: User, token: string) => void;
  onUserLogout: () => void;
  onUpdateUser: (user: User) => void;
  onNotify: (msg: string) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserLogin,
  onUserLogout,
  onUpdateUser,
  onNotify,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Address Management state
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrFull, setNewAddrFull] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [showAddAddrForm, setShowAddAddrForm] = useState(false);

  if (!isOpen) return null;

  const currentAddresses: SavedAddress[] = currentUser?.addressesJson
    ? JSON.parse(currentUser.addressesJson)
    : currentUser?.addresses || [];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await api.userLogin({ email, password });
      let parsedUser = res.user;
      if (parsedUser.addressesJson) {
        try {
          parsedUser.addresses = JSON.parse(parsedUser.addressesJson);
        } catch {
          parsedUser.addresses = [];
        }
      }
      onUserLogin(parsedUser, res.token);
      onNotify(`Welcome back, ${parsedUser.name}!`);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.userRegister({ name, email, password, phone });
      let parsedUser = res.user;
      parsedUser.addresses = [];
      onUserLogin(parsedUser, res.token);
      onNotify(`Account created successfully! Welcome ${parsedUser.name}.`);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newAddrFull.trim() || !newAddrCity.trim() || !newAddrPincode.trim()) {
      alert('Please fill out address, city, and pincode');
      return;
    }

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle || 'Home',
      fullAddress: newAddrFull.trim(),
      city: newAddrCity.trim(),
      pincode: newAddrPincode.trim(),
      isDefault: currentAddresses.length === 0,
    };

    const updatedAddresses = [...currentAddresses, newAddr];
    setLoading(true);
    try {
      const res = await api.updateUserAddresses(currentUser.id, updatedAddresses);
      const updatedUser = {
        ...currentUser,
        addressesJson: JSON.stringify(updatedAddresses),
        addresses: updatedAddresses,
      };
      onUpdateUser(updatedUser);
      onNotify(`Added address "${newAddr.title}" successfully!`);
      setNewAddrFull('');
      setNewAddrCity('');
      setNewAddrPincode('');
      setShowAddAddrForm(false);
    } catch (err: any) {
      alert('Failed to save address: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!currentUser) return;
    if (!confirm('Remove this saved address?')) return;
    const updated = currentAddresses.filter((a) => a.id !== addrId);
    setLoading(true);
    try {
      await api.updateUserAddresses(currentUser.id, updated);
      const updatedUser = {
        ...currentUser,
        addressesJson: JSON.stringify(updated),
        addresses: updated,
      };
      onUpdateUser(updatedUser);
      onNotify('Address removed');
    } catch (err: any) {
      alert('Failed to remove address: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '90%',
          margin: ' auto',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--coffee-primary)',
            color: 'white',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserIcon size={24} />
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
              {currentUser
                ? 'My Account & Addresses'
                : mode === 'login'
                ? 'User Login'
                : 'Create Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {errorMsg && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* LOGGED IN USER PROFILE & ADDRESS MANAGEMENT */}
          {currentUser ? (
            <div>
              <div
                style={{
                  background: '#fffaf5',
                  border: '1px solid #f3d5c0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  📧 {currentUser.email} {currentUser.phone && `• 📞 ${currentUser.phone}`}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}
              >
                <h4 style={{ margin: 0, fontSize: '16px', color: '#1a1a1a' }}>
                  Saved Addresses ({currentAddresses.length})
                </h4>
                <button
                  className="about-btn"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => setShowAddAddrForm(!showAddAddrForm)}
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddrForm && (
                <form
                  onSubmit={handleAddAddress}
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={newAddrTitle}
                      onChange={(e) => setNewAddrTitle(e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '13px',
                      }}
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 110049)"
                      required
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Flat / Street Address"
                    required
                    value={newAddrFull}
                    onChange={(e) => setNewAddrFull(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '13px',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="City (e.g. Delhi / Gurgaon)"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '13px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="about-btn"
                      style={{ flex: 1, padding: '6px' }}
                      onClick={() => setShowAddAddrForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="checkout-btn"
                      style={{ flex: 2, padding: '6px' }}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Address Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                {currentAddresses.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#888' }}>
                    No saved addresses yet. Save up to 3 addresses (Home, Office, Other) for instant checkout!
                  </p>
                ) : (
                  currentAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        background: '#fafafa',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              background: 'var(--coffee-primary)',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {addr.title}
                          </span>
                          <span style={{ fontSize: '13px', color: '#666' }}>{addr.pincode}</span>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '4px', color: '#333' }}>
                          {addr.fullAddress}, {addr.city}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                        title="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                <button
                  onClick={() => {
                    onUserLogout();
                    onNotify('Logged out of account');
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : mode === 'login' ? (
            /* USER LOGIN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <div className="search-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <Mail size={16} color="#888" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '4px' }}>
                  Password
                </label>
                <div className="search-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <Lock size={16} color="#888" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Don't have an account?{' '}
                <span
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  style={{ color: 'var(--coffee-primary)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Register Here
                </span>
              </p>
            </form>
          ) : (
            /* USER REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div className="search-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <UserIcon size={16} color="#888" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aniket Jindal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <div className="search-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <Mail size={16} color="#888" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div className="search-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <Phone size={16} color="#888" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '4px' }}>
                  Create Password
                </label>
                <div className="search-box" style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <Lock size={16} color="#888" />
                  <input
                    type="password"
                    required
                    placeholder="At least 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Already registered?{' '}
                <span
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  style={{ color: 'var(--coffee-primary)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
