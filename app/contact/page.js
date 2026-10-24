'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar" style={{ position: 'relative' }}>
        <div className="container">
          <Link href="/">
            <Image src="/images/logo.jpg" alt="Kalyanam Shopping Mall" width={180} height={48} className="navbar-logo" priority />
          </Link>
          <div className="navbar-actions">
            <Link href="/" className="nav-action-btn"><span className="icon">🏠</span><span>Home</span></Link>
            <Link href="/stores" className="nav-action-btn"><span className="icon">🏪</span><span>Stores</span></Link>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <div className="gold-divider" style={{ margin: '12px auto' }}></div>
          <p className="breadcrumb">
            <Link href="/">Home</Link> / <span style={{ color: '#fff' }}>Contact</span>
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section style={{ padding: 'var(--space-4xl) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '8px' }}>
                Get in <span style={{ color: 'var(--color-primary)' }}>Touch</span>
              </h2>
              <div className="gold-divider" style={{ margin: '12px 0 24px' }}></div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
                We&apos;d love to hear from you! Whether you have a question about our saree collections,
                need help with an order, or want to schedule a personal video shopping session — our team is here to help.
              </p>

              {/* Contact Cards */}
              {[
                { icon: '📍', title: 'Visit Our Flagship Store', info: 'Kamma Sangham Building, Nagarjuna Nagar Colony, Ameerpet, Hyderabad - 500016', action: 'Get Directions', link: 'https://maps.google.com/?q=Ameerpet+Hyderabad' },
                { icon: '📞', title: 'Call Us', info: '+91-9701888366', action: 'Call Now', link: 'tel:+919701888366' },
                { icon: '✉️', title: 'Email Us', info: 'info@kalyanamshoppingmall.com', action: 'Send Email', link: 'mailto:info@kalyanamshoppingmall.com' },
                { icon: '💬', title: 'WhatsApp Video Shopping', info: 'Book a live video call to see our collection from home', action: 'Connect on WhatsApp', link: 'https://wa.me/919701888366' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px', marginBottom: '20px',
                  padding: '20px', background: 'var(--color-surface)',
                  borderRadius: '12px', border: '1px solid var(--color-border-light)',
                  transition: 'all 250ms ease',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'var(--color-accent-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>{item.info}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)',
                    }}>{item.action} →</a>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-accent)' }}>
                  FOLLOW US
                </h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { icon: '📸', label: 'Instagram', url: 'https://instagram.com' },
                    { icon: '📘', label: 'Facebook', url: 'https://facebook.com' },
                    { icon: '🎬', label: 'YouTube', url: 'https://youtube.com' },
                  ].map((social, i) => (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '8px',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 500,
                    }}>
                      {social.icon} {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{
              background: 'var(--color-surface)', borderRadius: '16px',
              padding: '36px', boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border-light)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>
                Send Us a Message
              </h3>

              {submitted ? (
                <div style={{
                  textAlign: 'center', padding: '48px 20px',
                  background: 'rgba(22, 163, 74, 0.06)', borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-success)' }}>
                    Message Sent Successfully!
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                    Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91-XXXXXXXXXX' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  ].map((field) => (
                    <div key={field.name} style={{ marginBottom: '18px' }}>
                      <label style={{
                        display: 'block', fontSize: '0.82rem', fontWeight: 600,
                        marginBottom: '6px', color: 'var(--color-text)',
                      }}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required
                        id={`contact-${field.name}`}
                        style={{
                          width: '100%', padding: '11px 14px', borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.88rem', fontFamily: 'var(--font-body)',
                          outline: 'none', transition: 'border-color 150ms ease',
                          background: 'var(--color-bg)',
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      id="contact-subject"
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.88rem', fontFamily: 'var(--font-body)',
                        outline: 'none', background: 'var(--color-bg)', cursor: 'pointer',
                      }}
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Enquiry</option>
                      <option value="product">Product Question</option>
                      <option value="video">Video Shopping Appointment</option>
                      <option value="return">Returns & Exchange</option>
                      <option value="bulk">Bulk / Wholesale Order</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      id="contact-message"
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.88rem', fontFamily: 'var(--font-body)',
                        outline: 'none', resize: 'vertical', background: 'var(--color-bg)',
                      }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="contact-submit">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
