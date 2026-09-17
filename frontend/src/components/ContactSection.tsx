import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  settings: SiteSettings;
  onNotify: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onNotify,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please provide your name and email address.');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitContact({ name, email, phone, message });
      onNotify('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-card-box">
          {/* Form Column */}
          <div className="contact-form-side">
            <h2>
              Contact <span>Us</span>
            </h2>
            <p>
              Have a question about our beans, catering for an event, or custom orders? Reach out to us anytime!
            </p>

            <form onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="contact-form-group">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="contact-form-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="contact-form-group">
                <textarea
                  placeholder="How can we help you?"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="contact-send-btn"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info Column */}
          <div className="contact-info-side" id="col">
            <h3>Contact Info</h3>

            <div className="info-row">
              <Mail size={20} />
              <span>{settings.email || 'coffeeshop@gmail.com'}</span>
            </div>

            <div className="info-row">
              <Phone size={20} />
              <span>{settings.phone || '+91 00000 00000'}</span>
            </div>

            <div className="info-row">
              <MapPin size={20} />
              <span>{settings.address || 'Shahpur Jat, Delhi, India'}</span>
            </div>

            <p className="contact-note">
              {settings.contactNote ||
                'Visit our roastery cafe for fresh pours, tasting flights, and freshly roasted single-origin bag purchases.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
