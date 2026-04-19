import { useState, useEffect } from "react";
import { api } from "./api";
import AdminPanel from "./components/AdminPanel";

type Complaint = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  isAnonymous?: boolean;
  isPublic?: boolean;
  userId?: string;
};

type Notification = {
  id: string;
  eventType: string;
  message: string;
  read: boolean;
  complaintId: string;
  createdAt: string;
};

export default function App() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [my, setMy] = useState<Complaint[]>([]);
  const [pub, setPub] = useState<Complaint[]>([]);

  const [tab, setTab] = useState<"my" | "admin" | "public">("my");
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);
  const [registrationRole, setRegistrationRole] = useState<"USER" | "ADMIN">("USER");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");
    if (saved) {
      setToken(saved);
      setRole(savedRole);
      setCurrentUserEmail(savedEmail || "");
    }
  }, []);

  const handleRegister = async () => {
    try {
      const res = await api.register(email, password, registrationRole);
      alert(res.message || "Registered successfully");
      setMode("login");
      setEmail("");
      setPassword("");
      setRegistrationRole("USER");
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await api.login(email, password);

      if (res.token && res.role) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("email", email);
        setToken(res.token);
        setRole(res.role);
        setCurrentUserEmail(email);
        alert("Login successful");

        // Load notifications immediately with the token
        loadNotifications(res.token);
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setToken("");
    setRole(null);
    setCurrentUserEmail("");
    setMy([]);
    setPub([]);
    setTitle("");
    setDescription("");
    setEmail("");
    setPassword("");
    setTab("my");
    setNotifications([]);
    setUnreadCount(0);
  };

  const loadNotifications = async (authToken: string) => {
    try {
      const res = await api.getUnreadNotifications(authToken);
      setNotifications(res);
      setUnreadCount(res.length);
    } catch (err: any) {
      console.error("Failed to load notifications:", err.message);
    }
  };

  const handleNotificationRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId, token);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err: any) {
      alert(err.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead(token);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      alert(err.message || "Failed to mark all as read");
    }
  };

  const create = async () => {
    try {
      await api.createComplaint({ title, description }, token);
      alert("Complaint created successfully");

      setTitle("");
      setDescription("");
      loadMy();
      loadPublic();
    } catch (err: any) {
      alert(err.message || "Failed to create complaint");
    }
  };

  const loadMy = async () => {
    try {
      const res = await api.getMy(token);
      setMy(res);
    } catch (err: any) {
      alert(err.message || "Failed to load your complaints");
    }
  };

  const loadPublic = async () => {
    try {
      const res = await api.getPublic();
      setPub(res);
    } catch (err: any) {
      alert(err.message || "Failed to load public complaints");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.updateStatus(id, newStatus, token);
      alert("Status updated successfully");
      setExpandedStatusId(null);
      loadMy();
      loadPublic();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleVisibilityUpdate = async (
    id: string,
    isPublic: boolean,
    isAnonymous: boolean
  ) => {
    try {
      await api.updateVisibility(id, isPublic, isAnonymous, token);
      alert("Visibility updated successfully");
      loadMy();
      loadPublic();
    } catch (err: any) {
      alert(err.message || "Failed to update visibility");
    }
  };

  const statusTransitions: { [key: string]: string[] } = {
    SUBMITTED: ["UNDER_REVIEW"],
    UNDER_REVIEW: ["IN_PROGRESS", "REJECTED"],
    IN_PROGRESS: ["RESOLVED", "REJECTED"],
    RESOLVED: ["CLOSED"],
    REJECTED: ["CLOSED"],
    CLOSED: [],
  };

  const ComplaintCardContent = ({
    complaint,
    showStatusButton,
    showVisibilityButton,
  }: {
    complaint: Complaint;
    showStatusButton?: boolean;
    showVisibilityButton?: boolean;
  }) => (
    <>
      <h4 style={styles.complaintTitle}>{complaint.title}</h4>

      {complaint.description && (
        <p style={styles.complaintDesc}>{complaint.description}</p>
      )}

      <div style={styles.badgeRow}>
        {complaint.status && (
          <span style={styles.badge}>Status: {complaint.status}</span>
        )}
        <span style={styles.badge}>
          {complaint.isPublic ? "Public" : "Private"}
        </span>
        <span style={styles.badge}>
          {complaint.isAnonymous ? "Anonymous" : "Named"}
        </span>
      </div>

      {(showStatusButton || showVisibilityButton) && (
        <div style={styles.buttonRow}>
          {showStatusButton && complaint.status && (
            <div>
              <button
                style={styles.secondaryButton}
                onClick={() =>
                  setExpandedStatusId(
                    expandedStatusId === complaint.id ? null : complaint.id
                  )
                }
              >
                Update Status
              </button>
              {expandedStatusId === complaint.id && (
                <div style={styles.statusDropdown}>
                  {statusTransitions[complaint.status]?.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      style={styles.statusOption}
                      onClick={() => handleStatusUpdate(complaint.id, nextStatus)}
                    >
                      → {nextStatus}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {showVisibilityButton && (
            <button
              style={styles.secondaryButton}
              onClick={() => {
                const newIsPublic = !complaint.isPublic;
                const newIsAnonymous = newIsPublic ? (complaint.isAnonymous || false) : false;
                handleVisibilityUpdate(complaint.id, newIsPublic, newIsAnonymous);
              }}
            >
              {complaint.isPublic ? "Make Private" : "Make Public"}
            </button>
          )}
        </div>
      )}
    </>
  );

  const styles: { [key: string]: React.CSSProperties } = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)",
      padding: "32px 16px",
      fontFamily: "Arial, sans-serif",
      color: "#0f172a",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
    },
    hero: {
      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
      color: "white",
      borderRadius: "24px",
      padding: "28px 24px",
      boxShadow: "0 20px 40px rgba(37, 99, 235, 0.18)",
      marginBottom: "24px",
    },
    heroTitle: {
      margin: 0,
      fontSize: "34px",
      fontWeight: 700,
    },
    heroText: {
      marginTop: "10px",
      marginBottom: 0,
      fontSize: "15px",
      opacity: 0.95,
      lineHeight: 1.6,
    },
    authWrapper: {
      display: "flex",
      justifyContent: "center",
      marginTop: "28px",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      border: "1px solid #e2e8f0",
    },
    authCard: {
      width: "100%",
      maxWidth: "430px",
      background: "white",
      borderRadius: "20px",
      padding: "28px",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      border: "1px solid #e2e8f0",
    },
    sectionTitle: {
      marginTop: 0,
      marginBottom: "18px",
      fontSize: "24px",
      fontWeight: 700,
      color: "#0f172a",
    },
    subTitle: {
      marginTop: 0,
      marginBottom: "14px",
      fontSize: "20px",
      fontWeight: 700,
    },
    authSwitch: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      background: "#f1f5f9",
      padding: "6px",
      borderRadius: "12px",
    },
    authTab: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      marginBottom: "14px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      background: "#f8fafc",
    },
    textarea: {
      width: "100%",
      minHeight: "130px",
      padding: "12px 14px",
      marginBottom: "14px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      resize: "vertical",
      background: "#f8fafc",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "14px",
      boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
    },
    secondaryButton: {
      background: "white",
      color: "#1e293b",
      border: "1px solid #cbd5e1",
      padding: "12px 18px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
    },
    dangerButton: {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
      padding: "12px 18px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "14px",
    },
    buttonRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "8px",
    },
    complaintCard: {
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "16px",
      marginBottom: "14px",
      background: "#f8fafc",
    },
    complaintTitle: {
      margin: 0,
      fontSize: "17px",
      fontWeight: 700,
      color: "#0f172a",
    },
    complaintDesc: {
      margin: "10px 0",
      color: "#475569",
      lineHeight: 1.5,
      fontSize: "14px",
    },
    badgeRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "8px",
    },
    badge: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      background: "#dbeafe",
      color: "#1d4ed8",
    },
    emptyState: {
      padding: "18px",
      textAlign: "center" as const,
      border: "1px dashed #cbd5e1",
      borderRadius: "14px",
      color: "#64748b",
      background: "#f8fafc",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "20px",
    },
    infoText: {
      margin: 0,
      color: "#475569",
      fontSize: "14px",
    },
    tabBar: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "8px",
    },
    tab: {
      padding: "10px 16px",
      borderRadius: "8px 8px 0 0",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
      background: "transparent",
      color: "#64748b",
    },
    tabActive: {
      background: "#2563eb",
      color: "white",
    },
    roleBadge: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      background: "#dbeafe",
      color: "#1d4ed8",
    },
    roleAdmin: {
      background: "#fecaca",
      color: "#b91c1c",
    },
    statusDropdown: {
      marginTop: "8px",
      padding: "8px",
      background: "#f1f5f9",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
    },
    statusOption: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #cbd5e1",
      background: "white",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: 600,
      textAlign: "left" as const,
    },
    roleSelectionContainer: {
      marginBottom: "18px",
    },
    roleLabel: {
      display: "block",
      marginBottom: "10px",
      fontSize: "14px",
      fontWeight: 600,
      color: "#0f172a",
    },
    roleOptions: {
      display: "flex",
      gap: "10px",
      marginBottom: "14px",
    },
    roleButton: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
      transition: "all 0.2s ease",
    },
    notificationBadge: {
      position: "absolute" as const,
      top: "-8px",
      right: "-8px",
      background: "#ef4444",
      color: "white",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: 700,
    },
    notificationDropdown: {
      position: "absolute" as const,
      top: "100%",
      right: 0,
      width: "360px",
      maxHeight: "400px",
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
      marginTop: "8px",
      zIndex: 1000,
      overflowY: "auto" as const,
    },
    notificationHeader: {
      padding: "16px",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    notificationItem: {
      padding: "12px 16px",
      borderBottom: "1px solid #f1f5f9",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    },
    notificationMessage: {
      margin: "0 0 4px 0",
      fontSize: "14px",
      fontWeight: 600,
      color: "#0f172a",
    },
    notificationTime: {
      fontSize: "12px",
      color: "#64748b",
    },
    emptyNotification: {
      padding: "24px 16px",
      textAlign: "center" as const,
      color: "#64748b",
      fontSize: "14px",
    },
    dismissButton: {
      background: "none",
      border: "none",
      color: "#94a3b8",
      cursor: "pointer",
      fontSize: "16px",
      padding: "0",
      marginTop: "4px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Digital Complaint Registry</h1>
          <p style={styles.heroText}>
            Submit complaints, track their status, and view public issues in one clean dashboard.
          </p>
        </div>

        {!token && (
          <div style={styles.authWrapper}>
            <div style={styles.authCard}>
              <div style={styles.authSwitch}>
                <button
                  onClick={() => setMode("login")}
                  style={{
                    ...styles.authTab,
                    background: mode === "login" ? "#2563eb" : "transparent",
                    color: mode === "login" ? "white" : "#334155",
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("register")}
                  style={{
                    ...styles.authTab,
                    background: mode === "register" ? "#2563eb" : "transparent",
                    color: mode === "register" ? "white" : "#334155",
                  }}
                >
                  Register
                </button>
              </div>

              <h2 style={styles.sectionTitle}>
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>

              {mode === "register" && (
                <div style={styles.roleSelectionContainer}>
                  <label style={styles.roleLabel}>Register as:</label>
                  <div style={styles.roleOptions}>
                    <button
                      style={{
                        ...styles.roleButton,
                        background: registrationRole === "USER" ? "#2563eb" : "white",
                        color: registrationRole === "USER" ? "white" : "#1e293b",
                      }}
                      onClick={() => setRegistrationRole("USER")}
                    >
                      User
                    </button>
                    <button
                      style={{
                        ...styles.roleButton,
                        background: registrationRole === "ADMIN" ? "#2563eb" : "white",
                        color: registrationRole === "ADMIN" ? "white" : "#1e293b",
                      }}
                      onClick={() => setRegistrationRole("ADMIN")}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              )}

              <input
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {mode === "login" ? (
                <button style={styles.primaryButton} onClick={handleLogin}>
                  Login
                </button>
              ) : (
                <button style={styles.primaryButton} onClick={handleRegister}>
                  Register
                </button>
              )}
            </div>
          </div>
        )}

        {token && (
          <>
            <div style={styles.topBar}>
              <div>
                <h2 style={{ ...styles.sectionTitle, marginBottom: "6px" }}>
                  Dashboard
                </h2>
                <p style={styles.infoText}>
                  {currentUserEmail}{" "}
                  {role && (
                    <span
                      style={{
                        ...styles.roleBadge,
                        ...(role === "ADMIN" ? styles.roleAdmin : {}),
                      }}
                    >
                      {role === "ADMIN" ? "Admin" : "User"}
                    </span>
                  )}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <button
                    style={{
                      ...styles.secondaryButton,
                      position: "relative",
                      padding: "12px 14px",
                    }}
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    🔔 {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
                  </button>

                  {showNotifications && (
                    <div style={styles.notificationDropdown}>
                      <div style={styles.notificationHeader}>
                        <h3 style={{ margin: "0" }}>Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#2563eb",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div style={styles.emptyNotification}>
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} style={styles.notificationItem}>
                            <div style={{ flex: 1 }}>
                              <p style={styles.notificationMessage}>
                                {notif.message}
                              </p>
                              <span style={styles.notificationTime}>
                                {new Date(notif.createdAt).toLocaleDateString()}{" "}
                                {new Date(notif.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <button
                              onClick={() => handleNotificationRead(notif.id)}
                              style={styles.dismissButton}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button style={styles.dangerButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.subTitle}>Create Complaint</h3>

              <input
                style={styles.input}
                placeholder="Complaint title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                style={styles.textarea}
                placeholder="Describe your issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div style={styles.buttonRow}>
                <button style={styles.primaryButton} onClick={create}>
                  Create Complaint
                </button>
                <button style={styles.secondaryButton} onClick={loadMy}>
                  Load My Complaints
                </button>
                <button style={styles.secondaryButton} onClick={loadPublic}>
                  Load Public Complaints
                </button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.tabBar}>
                <button
                  style={{
                    ...styles.tab,
                    ...(tab === "my" ? styles.tabActive : {}),
                  }}
                  onClick={() => setTab("my")}
                >
                  My Complaints
                </button>
                {role === "ADMIN" && (
                  <button
                    style={{
                      ...styles.tab,
                      ...(tab === "admin" ? styles.tabActive : {}),
                    }}
                    onClick={() => setTab("admin")}
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  style={{
                    ...styles.tab,
                    ...(tab === "public" ? styles.tabActive : {}),
                  }}
                  onClick={() => setTab("public")}
                >
                  Public Complaints
                </button>
              </div>

              {tab === "my" && (
                <>
                  <h3 style={styles.subTitle}>My Complaints</h3>
                  {my.length === 0 ? (
                    <div style={styles.emptyState}>
                      No complaints loaded yet.
                    </div>
                  ) : (
                    my.map((c) => (
                      <div key={c.id} style={styles.complaintCard}>
                        <ComplaintCardContent
                          complaint={c}
                          showStatusButton={role === "ADMIN"}
                          showVisibilityButton={true}
                        />
                      </div>
                    ))
                  )}
                </>
              )}

              {tab === "admin" && role === "ADMIN" && (
                <AdminPanel token={token} />
              )}

              {tab === "public" && (
                <>
                  <h3 style={styles.subTitle}>Public Complaints</h3>
                  {pub.length === 0 ? (
                    <div style={styles.emptyState}>
                      No public complaints loaded yet.
                    </div>
                  ) : (
                    pub.map((c) => (
                      <div key={c.id} style={styles.complaintCard}>
                        <ComplaintCardContent complaint={c} />
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}