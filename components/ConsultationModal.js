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
      muhurtham: true,
    },
  });
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isConsultationModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedWeaves = Object.keys(formData.weaves).filter((k) => formData.weaves[k]);
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          date: formData.date,
          slot: formData.slot,
          weaves: selectedWeaves,
        }),
      });
      setIsSuccess(true);
      showToast('Video Shopping appointment request confirmed!');
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
            muhurtham: true,
          },
        });
      }, 3500);
    } catch (err) {
      showToast('Could not schedule session. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-space-lg shadow-2xl relative flex flex-col gap-space-md border border-secondary-fixed/30 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              videocam
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Schedule Bridal Video Shopping
            </h3>
          </div>
          <button
            onClick={() => setIsConsultationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Connect with our master saree stylists from Hyderabad. We will showcase your selected colors, borders, and pallu drapings in real-time over WhatsApp / Zoom HD video.
        </p>

        {isSuccess ? (
          <div className="p-4 bg-tertiary-container text-on-tertiary rounded-xl text-body-sm font-body-sm text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[36px]">
              verified
            </span>
            <p className="font-title-md text-title-md font-bold">
              Auspicious greeting, {formData.name || 'Valued Bride'}!
            </p>
            <p>
              Your session request has been received. Our chief stylist will message your WhatsApp at <strong>{formData.phone}</strong> with the private HD joining link within 30 minutes.
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                Your Full Name
              </label>
              <input
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
                placeholder="e.g. Sravanthi Reddy"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                WhatsApp Mobile Number
              </label>
              <input
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
                placeholder="+91 / +1 (Country Code) Mobile"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                  Preferred Date
                </label>
                <input
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                  Time Slot (IST)
                </label>
                <select
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                >
                  <option>11:00 AM - 12:00 PM</option>
                  <option>02:00 PM - 03:00 PM</option>
                  <option>04:00 PM - 05:00 PM</option>
                  <option>07:00 PM - 08:00 PM (US Friendly)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                Weave Interest
              </label>
              <div className="flex flex-wrap gap-2 text-label-sm font-label-sm">
                <label className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded cursor-pointer">
                  <input
                    checked={formData.weaves.kanchipuram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weaves: { ...formData.weaves, kanchipuram: e.target.checked },
                      })
                    }
                    className="accent-primary"
                    type="checkbox"
                  />
                  <span>Kanchipuram</span>
                </label>

                <label className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded cursor-pointer">
                  <input
                    checked={formData.weaves.banarasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weaves: { ...formData.weaves, banarasi: e.target.checked },
                      })
                    }
                    className="accent-primary"
                    type="checkbox"
                  />
                  <span>Banarasi</span>
                </label>

                <label className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded cursor-pointer">
                  <input
                    checked={formData.weaves.gadwal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weaves: { ...formData.weaves, gadwal: e.target.checked },
                      })
                    }
                    className="accent-primary"
                    type="checkbox"
                  />
                  <span>Gadwal</span>
                </label>

                <label className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded cursor-pointer">
                  <input
                    checked={formData.weaves.muhurtham}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weaves: { ...formData.weaves, muhurtham: e.target.checked },
                      })
                    }
                    className="accent-primary"
                    type="checkbox"
                  />
                  <span>Muhurtham Red</span>
                </label>
              </div>
            </div>

            <button
              className="w-full mt-2 py-3 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md font-semibold hover:bg-surface-tint shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Confirm Video Shopping Session</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
