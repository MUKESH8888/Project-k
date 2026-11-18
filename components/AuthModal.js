"use client";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";
export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
  } = useAuth();
  return isAuthModalOpen ? (
    <AuthForm
      key={authModalMode}
      mode={authModalMode}
      close={() => setIsAuthModalOpen(false)}
      change={setAuthModalMode}
      login={login}
      register={register}
    />
  ) : null;
}
function AuthForm({ mode, close, change, login, register }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const signup = mode === "register";
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (signup) await register(data);
      else await login(data.email, data.password);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={signup ? "Create account" : "Sign in"} onClose={close}>
      <p className="eyebrow">WELCOME TO KALYANAM</p>
      <h2>{signup ? "A beautiful beginning." : "Good to see you again."}</h2>
      <p>
        {signup
          ? "Save your favourites and keep your celebrations close."
          : "Sign in to your account."}
      </p>
      <form className="stack-form" onSubmit={submit}>
        {signup && (
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
        )}
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            required
            minLength={signup ? 10 : 1}
            maxLength={128}
          />
        </label>
        {signup && <small>Use at least 10 characters.</small>}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button" disabled={busy}>
          {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
        </button>
      </form>
      <button
        className="text-link"
        onClick={() => change(signup ? "login" : "register")}
      >
        {signup
          ? "Already have an account? Sign in"
          : "New here? Create an account"}
      </button>
    </Modal>
  );
}
