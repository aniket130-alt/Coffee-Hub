import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, MapPin, Compass, Utensils, Truck, Store } from 'lucide-react';
import { CartItem, User, Hub, SavedAddress } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: User | null;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNotify: (msg: string) => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNotify,
  onOpenAuth,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderType, setOrderType] = useState<'Delivery' | 'Dine-in' | 'Pickup'>('Delivery');
  
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [tableNo, setTableNo] = useState('');

  // Hub Finder state
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [nearbyMessage, setNearbyMessage] = useState<string | null>(null);
  const [searchingHub, setSearchingHub] = useState(false);

  // Auto populate customer fields if logged in
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      const addrs: SavedAddress[] = currentUser.addressesJson
        ? JSON.parse(currentUser.addressesJson)
        : currentUser.addresses || [];
      if (addrs.length > 0) {
        setAddress(addrs[0].fullAddress);
        setPincode(addrs[0].pincode || '');
      }
    }
  }, [currentUser]);

  // Fetch available hubs on checkout
  useEffect(() => {
    if (isCheckingOut) {
      api.getHubs().then((data) => {
        setHubs(data);
        if (data.length > 0 && !selectedHub) {
          setSelectedHub(data[0].name);
        }
      }).catch(() => {});
    }
  }, [isCheckingOut]);

  if (!isOpen) return null;

  const savedAddresses: SavedAddress[] = currentUser?.addressesJson
    ? JSON.parse(currentUser.addressesJson)
    : currentUser?.addresses || [];

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleFindNearbyHub = async () => {
    if (!pincode.trim() && !address.trim()) {
      alert('Please enter a pincode or address to find the nearest coffee hub');
      return;
    }
    setSearchingHub(true);
    setNearbyMessage(null);
    try {
      const res = await api.findNearbyHub({ pincode: pincode.trim(), address: address.trim() });
      if (res.found && res.hub) {
        setSelectedHub(res.hub.name);
        setNearbyMessage(`📍 ${res.hub.name} (${res.distanceKm || '1.5'} km away)`);
        onNotify(`Found nearest hub: ${res.hub.name}`);
      } else {
        setNearbyMessage('No exact hub match found; primary hub assigned.');
      }
    } catch {
      setNearbyMessage('Unable to locate nearby hub automatically.');
    } finally {
      setSearchingHub(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (orderType === 'Delivery' && !address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    if (orderType === 'Dine-in' && !tableNo.trim()) {
      alert('Please enter your table number for Dine-in service.');
      return;
    }

    try {
      await api.createOrder({
        userId: currentUser?.id,
        customerName: customerName.trim(),
        email: currentUser?.email || '',
        phone: phone.trim(),
        orderType,
        tableNo: orderType === 'Dine-in' ? tableNo.trim() : '',
        address: orderType === 'Delivery' ? address.trim() : (orderType === 'Dine-in' ? `Table #${tableNo.trim()}` : 'Store Pickup'),
        hubName: selectedHub || 'Primary Hub',
        totalAmount,
        itemsJson: JSON.stringify(cartItems),
      });

      onNotify(`🎉 ${orderType} order placed successfully! View in Admin Dashboard.`);
      onClearCart();
      setIsCheckingOut(false);
      setTableNo('');
      onClose();
    } catch (err: any) {
      alert('Failed to place order: ' + err.message);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '100%' }}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} />
            <h3 style={{ fontSize: '18px', margin: 0 }}>Your Coffee Cart</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart items list */}
        {!isCheckingOut ? (
          <>
            <div className="cart-drawer-items">
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>Your coffee cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="item-price">${item.price}</div>
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-total-row">
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--coffee-primary)' }}>${totalAmount}</span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          /* Checkout Form */
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '14px', color: '#1a1a1a' }}>
              Order Purpose & Details
            </h4>

            {/* PURPOSE SELECTION (Delivery vs Dine-in vs Pickup) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                style={{
                  padding: '10px 4px',
                  borderRadius: '8px',
                  border: orderType === 'Delivery' ? '2px solid var(--coffee-primary)' : '1px solid #ccc',
                  background: orderType === 'Delivery' ? '#fffaf5' : 'white',
                  color: orderType === 'Delivery' ? 'var(--coffee-primary)' : '#555',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Truck size={18} />
                🛵 Delivery
              </button>

              <button
                type="button"
                onClick={() => setOrderType('Dine-in')}
                style={{
                  padding: '10px 4px',
                  borderRadius: '8px',
                  border: orderType === 'Dine-in' ? '2px solid var(--coffee-primary)' : '1px solid #ccc',
                  background: orderType === 'Dine-in' ? '#fffaf5' : 'white',
                  color: orderType === 'Dine-in' ? 'var(--coffee-primary)' : '#555',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Utensils size={18} />
                🍽️ Dine-in
              </button>

              <button
                type="button"
                onClick={() => setOrderType('Pickup')}
                style={{
                  padding: '10px 4px',
                  borderRadius: '8px',
                  border: orderType === 'Pickup' ? '2px solid var(--coffee-primary)' : '1px solid #ccc',
                  background: orderType === 'Pickup' ? '#fffaf5' : 'white',
                  color: orderType === 'Pickup' ? 'var(--coffee-primary)' : '#555',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Store size={18} />
                🛍️ Pickup
              </button>
            </div>

            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
              {/* Customer Info */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aniket Jindal"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              {/* DINE-IN TABLE SELECTION */}
              {orderType === 'Dine-in' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
                    Table Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Table 4 / Patio Table 2"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
              )}

              {/* DELIVERY ADDRESS & SAVED ADDRESS SELECTION */}
              {orderType === 'Delivery' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>
                      Delivery Address *
                    </label>
                    {!currentUser && (
                      <span
                        onClick={onOpenAuth}
                        style={{ fontSize: '12px', color: 'var(--coffee-primary)', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Sign in for saved addresses
                      </span>
                    )}
                  </div>

                  {/* Saved Address Dropdown if logged in */}
                  {currentUser && savedAddresses.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <select
                        onChange={(e) => {
                          const selected = savedAddresses.find((a) => a.id === e.target.value);
                          if (selected) {
                            setAddress(`${selected.fullAddress}, ${selected.city}`);
                            setPincode(selected.pincode);
                          }
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #b2744c', background: '#fffaf5', fontSize: '13px' }}
                      >
                        <option value="">-- Choose from Saved Addresses ({savedAddresses.length}) --</option>
                        {savedAddresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            [{a.title}] {a.fullAddress}, {a.city} ({a.pincode})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    required
                    placeholder="Enter street, flat, landmark address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />

                  {/* NEARBY HUB FINDER WIDGET */}
                  <div style={{ marginTop: '10px', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Pincode (e.g. 110049)"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                      />
                      <button
                        type="button"
                        onClick={handleFindNearbyHub}
                        disabled={searchingHub}
                        style={{
                          background: 'var(--coffee-primary)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Compass size={14} />
                        {searchingHub ? 'Locating...' : 'Find Nearby Hub'}
                      </button>
                    </div>
                    {nearbyMessage && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                        {nearbyMessage}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COFFEE HUB ASSIGNMENT DROPDOWN */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
                  Fulfilling Store Branch / Hub
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                >
                  {hubs.map((h) => (
                    <option key={h.id} value={h.name}>
                      📍 {h.name} ({h.city} - {h.pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                <div className="cart-total-row">
                  <span>Payable Total:</span>
                  <span style={{ color: 'var(--coffee-primary)' }}>${totalAmount}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="about-btn"
                    style={{ flex: 1 }}
                    onClick={() => setIsCheckingOut(false)}
                  >
                    Back
                  </button>
                  <button type="submit" className="checkout-btn" style={{ flex: 2 }}>
                    Confirm {orderType} Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
