"use client";
import { useState } from "react";
import { useCart } from "./CartContext";
import Modal from "./Modal";
export default function ConsultationModal() {
  const { isConsultationModalOpen, setIsConsultationModalOpen } = useCart();
  return isConsultationModalOpen ? (
    <Form close={() => setIsConsultationModalOpen(false)} />
  ) : null;
}
function Form({ close }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Personal shopping appointment" onClose={close}>
      <p className="eyebrow">LET’S FIND YOUR PERFECT PIECE</p>
      <h2>{done ? "Request received." : "A moment, just for you."}</h2>
      {done ? (
        <>
          <p>
            Our team will contact you to confirm your appointment. Your selected
            time is a preference, subject to availability.
          </p>
          <button className="button" onClick={close}>
            Done
          </button>
        </>
      ) : (
        <form className="stack-form" onSubmit={submit}>
          <label>
            Your name
            <input name="customerName" required maxLength={100} />
          </label>
          <label>
            Phone number
            <input
              name="customerPhone"
              type="tel"
              required
              pattern="[+0-9 -]{10,16}"
            />
          </label>
          <label>
            Preferred date
            <input
              name="date"
              type="date"
              required
              min={new Date().toLocaleDateString("en-CA", {
                timeZone: "Asia/Kolkata",
              })}
            />
          </label>
          <label>
            Preferred time (IST)
            <select name="slot">
              <option>11:00 AM – 12:00 PM</option>
              <option>2:00 PM – 3:00 PM</option>
              <option>5:00 PM – 6:00 PM</option>
            </select>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? "Sending…" : "Request an appointment"}
          </button>
        </form>
      )}
    </Modal>
  );
}
