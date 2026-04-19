import { useState, useEffect } from "react";
import { api } from "../api";

type Complaint = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  isAnonymous?: boolean;
  isPublic?: boolean;
  userId?: string;
};

export default function AdminPanel({ token }: { token: string }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statusTransitions: { [key: string]: string[] } = {
    SUBMITTED: ["UNDER_REVIEW"],
    UNDER_REVIEW: ["IN_PROGRESS", "REJECTED"],
    IN_PROGRESS: ["RESOLVED", "REJECTED"],
    RESOLVED: ["CLOSED"],
    REJECTED: ["CLOSED"],
    CLOSED: [],
  };

  useEffect(() => {
    loadAllComplaints();
  }, []);

  const loadAllComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getAllComplaints(token);
      setComplaints(data);
    } catch (err: any) {
      alert(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.updateStatus(id, newStatus, token);
      alert("Status updated successfully");
      setExpandedStatusId(null);
      loadAllComplaints();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    adminContainer: {
      marginTop: "12px",
    },
    subTitle: {
      marginTop: 0,
      marginBottom: "14px",
      fontSize: "20px",
      fontWeight: 700,
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
    buttonRow: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "8px",
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
    emptyState: {
      padding: "18px",
      textAlign: "center" as const,
      border: "1px dashed #cbd5e1",
      borderRadius: "14px",
      color: "#64748b",
      background: "#f8fafc",
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
  };

  if (loading) {
    return <div style={styles.emptyState}>Loading complaints...</div>;
  }

  return (
    <div style={styles.adminContainer}>
      <h3 style={styles.subTitle}>All Complaints (Admin View)</h3>

      <button
        style={styles.secondaryButton}
        onClick={loadAllComplaints}
      >
        Refresh
      </button>

      {complaints.length === 0 ? (
        <div style={styles.emptyState}>No complaints found.</div>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint.id} style={styles.complaintCard}>
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

            {complaint.status && (
              <div style={styles.buttonRow}>
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
                        onClick={() =>
                          handleStatusUpdate(complaint.id, nextStatus)
                        }
                      >
                        → {nextStatus}
                      </button>
                    ))}
                    {statusTransitions[complaint.status]?.length === 0 && (
                      <div style={{ ...styles.statusOption, cursor: "default" }}>
                        No transitions available
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
