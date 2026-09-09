const titles = {
  login: "Sign in",
  register: "Create account",
  verify: "Verify email",
  forgot: "Forgot password",
  reset: "Reset password"
};

function AuthForm({ mode, form, otp, message, messageType, retryAfter, busy, onChange, onOtpChange, onSubmit, onModeChange, onResend }) {
  const isCodeMode = mode === "verify" || mode === "reset";
  const isPasswordMode = mode === "login" || mode === "register" || mode === "reset";

  return (
    <section className="card">
      <p className="label">AUTHAPI DEMO</p>
      <h1>{titles[mode]}</h1>
      <p>
        {mode === "verify" && `Enter the code sent to ${form.email}.`}
        {mode === "reset" && "Enter your code and a new password."}
        {mode === "forgot" && "We will send a reset code to your email."}
        {mode === "register" && "Create a new account to get started."}
        {mode === "login" && "Use your account to continue."}
      </p>
      <form onSubmit={onSubmit}>
        {mode === "register" && <label>Username<input name="username" value={form.username} onChange={onChange} required /></label>}
        <label>Email<input name="email" type="email" value={form.email} onChange={onChange} required /></label>
        {isCodeMode && <label>Verification code<input value={otp} onChange={onOtpChange} inputMode="numeric" maxLength="6" required /></label>}
        {isPasswordMode && <label>{mode === "reset" ? "New password" : "Password"}<input name="password" type="password" value={form.password} onChange={onChange} required /></label>}
        <button type="submit" disabled={busy}>{busy ? "Please wait..." : mode === "verify" ? "Verify email" : mode === "reset" ? "Reset password" : mode === "forgot" ? "Send code" : mode === "register" ? "Register" : "Login"}</button>
      </form>
      {message && <p className={`message ${messageType}`}>{message}{retryAfter > 0 && ` Try again in ${retryAfter} seconds.`}</p>}
      {mode === "verify" && <button className="link" disabled={busy} onClick={onResend}>Send code again</button>}
      {mode === "login" && <button className="link" disabled={busy} onClick={() => onModeChange("register")}>Need an account? Register</button>}
      {mode === "register" && <button className="link" disabled={busy} onClick={() => onModeChange("login")}>Already have an account? Sign in</button>}
      {mode === "login" && <button className="link" disabled={busy} onClick={() => onModeChange("forgot")}>Forgot password?</button>}
      {mode !== "login" && <button className="link" disabled={busy} onClick={() => onModeChange("login")}>Back to sign in</button>}
    </section>
  );
}

export default AuthForm;
