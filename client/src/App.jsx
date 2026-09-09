import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import ActivityPanel from "./components/ActivityPanel";
import { api } from "./api";

function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [retryAfter, setRetryAfter] = useState(0);
  const [busy, setBusy] = useState(false);
  const [activity, setActivity] = useState({ title: "Ready", steps: ["Waiting for an action"], status: "idle", startedAt: 0, elapsed: 0 });

  useEffect(() => {
    if (!retryAfter) return;
    const timer = setInterval(() => setRetryAfter((seconds) => Math.max(seconds - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [retryAfter]);

  useEffect(() => {
    if (!user || !token) return;
    const timer = setTimeout(refresh, 14 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [user, token]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const startActivity = (title, steps) => setActivity({ title, steps, status: "working", startedAt: Date.now(), elapsed: 0 });
  const changeMode = (nextMode) => { setMode(nextMode); setMessage(""); setMessageType("success"); setRetryAfter(0); startActivity(`Opening ${nextMode} form`, ["Changing the authentication view"]); };
  const showMessage = (text) => { setMessage(text); setMessageType("success"); setRetryAfter(0); setActivity((current) => ({ ...current, status: "success", elapsed: (Date.now() - current.startedAt) / 1000 })); };
  const showError = (error) => { setMessage(error.message); setMessageType("error"); setRetryAfter(error.retryAfter || 0); setActivity((current) => ({ ...current, status: "error", elapsed: (Date.now() - current.startedAt) / 1000 })); };
  const completeSession = () => setActivity((current) => ({ ...current, title: "Session active", steps: ["Validate credentials", "Find user account", "Compare bcrypt password", "Check email verification", "Find or create session", "Create access JWT", "Set refresh cookie", "Load protected profile"], status: "success", elapsed: (Date.now() - current.startedAt) / 1000 }));

  async function loadUser(accessToken) {
    const { user: currentUser } = await api("/api/auth/get-me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    setToken(accessToken);
    setUser(currentUser);
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setRetryAfter(0);
    const steps = {
      login: ["Checking credentials", "Creating access token", "Loading protected profile"],
      register: ["Validating account details", "Creating account", "Sending verification email"],
      verify: ["Checking verification code", "Verifying email address"],
      forgot: ["Checking email address", "Sending password reset code"],
      reset: ["Checking reset code", "Updating password"]
    };
    startActivity(`Running ${mode}`, steps[mode]);
    try {
      if (mode === "register") {
        setActivity((current) => ({ ...current, steps: ["Validate input", "Check duplicate email", "Hash password with bcrypt", "Create user account", "Generate OTP", "Save OTP hash", "Queue verification email"] }));
        await api("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
        changeMode("verify");
        showMessage("Enter the six-digit code sent to your email.");
        return;
      }
      if (mode === "verify") {
        setActivity((current) => ({ ...current, steps: ["Hash submitted OTP", "Find OTP record", "Check expiry and attempts", "Mark email as verified", "Remove used OTP"] }));
        await api("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ email: form.email, otp }) });
        changeMode("login");
        showMessage("Email verified. You can sign in now.");
        return;
      }
      if (mode === "forgot") {
        setActivity((current) => ({ ...current, steps: ["Find user account", "Generate reset OTP", "Save OTP hash and expiry", "Queue reset email"] }));
        await api("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: form.email }) });
        changeMode("reset");
        showMessage("Enter the reset code sent to your email.");
        return;
      }
      if (mode === "reset") {
        setActivity((current) => ({ ...current, steps: ["Hash submitted OTP", "Check expiry and attempts", "Hash new password", "Update user password", "Remove used OTP", "Queue success email"] }));
        await api("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ email: form.email, otp, newPassword: form.password }) });
        changeMode("login");
        showMessage("Password reset. You can sign in now.");
        return;
      }
      const { accessToken } = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) });
      await loadUser(accessToken);
      completeSession();
      showMessage("Session active.");
    } catch (error) {
      if (mode === "login" && error.message.toLowerCase().includes("not verified")) setMode("verify");
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    if (busy) return;
    setBusy(true);
    startActivity("Refreshing session", ["Read refresh cookie", "Verify refresh JWT", "Find active session", "Rotate refresh token", "Create new access JWT", "Load protected profile"]);
    try {
      const { newAccessToken } = await api("/api/auth/refresh", { method: "POST" });
      await loadUser(newAccessToken);
      showMessage("Token refreshed.");
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function resendOtp() {
    if (busy) return;
    setBusy(true);
    startActivity("Resending verification code", ["Find user account", "Remove old OTP", "Generate new OTP", "Save OTP hash and expiry", "Queue verification email"]);
    try {
      await api("/api/auth/new-otp", { method: "POST", body: JSON.stringify({ email: form.email }) });
      showMessage("A new code was sent.");
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function logout(path = "/api/auth/logout") {
    if (busy) return;
    setBusy(true);
    startActivity(path.endsWith("all") ? "Logging out everywhere" : "Logging out", path.endsWith("all") ? ["Read current user", "Find all active sessions", "Revoke every session", "Clear refresh cookie", "Clear local session"] : ["Read session ID from access JWT", "Find current session", "Revoke current session", "Clear refresh cookie", "Clear local session"]);
    try {
      await api(path, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      showMessage("Logged out.");
    } catch (error) {
      showError(error);
    } finally {
      setToken("");
      setUser(null);
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <div className="workspace">
        {user ? <Dashboard user={user} message={message} messageType={messageType} retryAfter={retryAfter} busy={busy} onRefresh={refresh} onLogout={logout} onLogoutAll={() => logout("/api/auth/logout-all")} /> : <AuthForm mode={mode} form={form} otp={otp} message={message} messageType={messageType} retryAfter={retryAfter} busy={busy} onChange={change} onOtpChange={(event) => setOtp(event.target.value)} onSubmit={submit} onModeChange={changeMode} onResend={resendOtp} />}
        <ActivityPanel activity={activity} />
      </div>
    </main>
  );
}

export default App;
