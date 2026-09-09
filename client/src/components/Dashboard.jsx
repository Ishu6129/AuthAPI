function Dashboard({ user, message, messageType, retryAfter, busy, onRefresh, onLogout, onLogoutAll }) {
  return (
    <section className="card">
      <p className="label">PROTECTED PAGE</p>
      <h1>Welcome, {user.username}</h1>
      <p>{user.email}</p>
      <p className={`message ${messageType}`}>{message || "Session active."}{retryAfter > 0 && ` Try again in ${retryAfter} seconds.`}</p>
      <div className="dashboard-actions">
        <button className="primary" disabled={busy} onClick={onRefresh}>{busy ? "Please wait..." : "Refresh token"}</button>
        <button className="secondary" disabled={busy} onClick={() => onLogout()}>Log out</button>
        <button className="secondary" disabled={busy} onClick={onLogoutAll}>Log out everywhere</button>
      </div>
    </section>
  );
}

export default Dashboard;
