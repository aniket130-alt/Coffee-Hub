import React, { useState } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNotify: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNotify,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderType, setOrderType] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number (numbers only).');
      return;
    }

    if (orderType === 'Delivery' && !address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    try {
      await api.createOrder({
        customerName: customerName.trim(),
        email: '',
        phone: phone.trim(),
        orderType,
        address: address.trim() || (orderType === 'Pickup' ? 'Store Pickup' : ''),
        totalAmount,
        itemsJson: JSON.stringify(cartItems),
      });

      onNotify(`🎉 ${orderType} order placed successfully! Check Admin dashboard for review.`);
      onClearCart();
      setIsCheckingOut(false);
      setCustomerName('');
      setPhone('');
      setAddress('');
      onClose();
    } catch (err: any) {
      alert('Failed to place order: ' + err.message);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
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

        {/* Content */}
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
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '16px', color: '#1a1a1a' }}>
              Delivery / Pickup Details
            </h4>
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
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
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
                  Delivery Address / Table No.
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Flat 402, Green Glen or Table 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
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
                    Confirm Order
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
