import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DogIcon, MailIcon, PhoneIcon, ClockIcon } from '../components/Icons';
import api from '../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.contact.submit(formData);
      setStatus({ type: 'success', message: 'Thank you! We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav className="nav">
        <div className="nav-content container">
          <Link to="/" className="nav-brand">
            <DogIcon size={32} />
            <span>PawWalkers</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/login" className="btn btn-primary">Client Login</Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Get in Touch</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MailIcon size={24} style={{ color: '#0ea5e9', marginTop: '4px' }} />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hello@pawwalkers.com" className="text-primary">hello@pawwalkers.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon size={24} style={{ color: '#0ea5e9', marginTop: '4px' }} />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:02012345678" className="text-primary">020 1234 5678</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon size={24} style={{ color: '#0ea5e9', marginTop: '4px' }} />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-gray-600">Monday - Saturday: 7am - 7pm</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Request a Booking</h2>
            
            {status.message && (
              <div className={`alert alert-${status.type}`}>{status.message}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your dog and what services you're interested in..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="card mt-8" style={{ backgroundColor: '#eff6ff' }}>
          <h3 className="font-semibold mb-2">Already a client?</h3>
          <p className="text-gray-600 mb-4">
            Access your bookings, pet information, and invoices through the client portal.
          </p>
          <Link to="/login" className="btn btn-primary">Go to Client Portal</Link>
        </div>
      </div>
    </div>
  );
}
