'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

export default function ConsultationModal() {
  const { isConsultationModalOpen, setIsConsultationModalOpen, showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    slot: '11:00 AM - 12:00 PM',
    weaves: {
      kanchipuram: true,
      banarasi: false,
      gadwal: false,
      pochampally: false,
      groom: false,
    },
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isConsultationModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please enter your name and WhatsApp phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const selectedWeaves = Object.keys(formData.weaves).filter((k) => formData.weaves[k]);
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          date: formData.date || new Date().toISOString().split('T')[0],
          slot: formData.slot,
          weaves: selectedWeaves,
        }),
      });
      setIsSuccess(true);
      showToast('Video Shopping appointment confirmed! Our stylist will message you shortly.');
      setTimeout(() => {
        setIsSuccess(false);
        setIsConsultationModalOpen(false);
        setFormData({
          name: '',
          phone: '',
          date: '',
          slot: '11:00 AM - 12:00 PM',
          weaves: {
            kanchipuram: true,
            banarasi: false,
            gadwal: false,
            pochampally: false,
            groom: false,
          },
        });
      }, 4000);
    } catch (err) {
      showToast('Could not schedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-[#DFC587]/60 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#7A1426] to-[#520B16] text-white p-6 relative">
          <button
            onClick={() => setIsConsultationModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
            <span>HD Live Video Drape</span>
          </div>

          <h2 className="font-heading text-2xl font-bold">
            Schedule Video Shopping Session
          </h2>
          <p className="text-xs text-white/80 mt-1 font-light leading-relaxed">
            Experience our Gudur &amp; Palakurthy showrooms from anywhere. A master stylist will drape sarees, show daylight pallu sheen, and answer questions.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <span className="material-symbols-outlined text-emerald-600 text-[56px]">
                verified
              </span>
              <h3 className="font-heading text-2xl font-bold text-charcoal">
                Auspicious Greetings, {formData.name}!
              </h3>
              <p className="text-xs text-[#555] max-w-sm mx-auto leading-relaxed">
                Your private video consultation has been reserved for <strong>{formData.slot}</strong>. Master stylist Sri Ramalingam will send your private joining link to <strong>{formData.phone}</strong> via WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sravanthi Reddy"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  WhatsApp Number (With Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98491 23456 / +1 408 555 0192"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={formData.slot}
                    onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                    className="input-field bg-white"
                  >
                    <option>11:00 AM - 12:00 PM (Morning)</option>
                    <option>02:00 PM - 03:00 PM (Afternoon)</option>
                    <option>04:00 PM - 05:00 PM (Evening)</option>
                    <option>07:00 PM - 08:00 PM (US Friendly)</option>
                    <option>09:00 PM - 10:00 PM (US Friendly)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Select Weaves of Interest
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'kanchipuram', label: 'Kanchipuram Silk' },
                    { key: 'banarasi', label: 'Banarasi Brocade' },
                    { key: 'gadwal', label: 'Gadwal Handloom' },
                    { key: 'pochampally', label: 'Pochampally Ikat' },
                    { key: 'groom', label: 'Groom Panche/Dhoti' },
                  ].map((weave) => (
                    <label
                      key={weave.key}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                        formData.weaves[weave.key]
                          ? 'bg-[#FAF3EA] border-[#C5A04B] text-charcoal font-semibold'
                          : 'bg-[#FAF7F2] border-[#EAE5DC] text-[#666]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.weaves[weave.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weaves: { ...formData.weaves, [weave.key]: e.target.checked },
                          })
                        }
                        className="accent-[#7A1426] w-3.5 h-3.5"
                      />
                      <span className="truncate">{weave.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-secondary w-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>{submitting ? 'Confirming Slot...' : 'Confirm Video Consultation'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
