const BASE_URL = "http://localhost:3000";

export const api = {
  // -------------------------
  // AUTH
  // -------------------------
  register: async (email: string, password: string, role: string = "USER") => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return res.json();
  },

  // -------------------------
  // COMPLAINTS
  // -------------------------
  createComplaint: async (
    data: { title: string; description: string },
    token: string
  ) => {
    const res = await fetch(`http://localhost:3000/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Request failed");
    }

    return json;
  },

  getMy: async (token: string) => {
    const res = await fetch(`${BASE_URL}/complaints/me/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  },

  getPublic: async () => {
    const res = await fetch(`${BASE_URL}/complaints/public/all`);
    return res.json();
  },

  // -------------------------
  // STATUS UPDATES (ADMIN)
  // -------------------------
  updateStatus: async (
    id: string,
    status: string,
    token: string
  ) => {
    const res = await fetch(`${BASE_URL}/complaints/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Failed to update status");
    }

    return json;
  },

  // -------------------------
  // VISIBILITY UPDATES
  // -------------------------
  updateVisibility: async (
    id: string,
    isPublic: boolean,
    isAnonymous: boolean,
    token: string
  ) => {
    const res = await fetch(`${BASE_URL}/complaints/${id}/visibility`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublic, isAnonymous }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Failed to update visibility");
    }

    return json;
  },

  // -------------------------
  // GET ALL COMPLAINTS (for admin search)
  // -------------------------
  getAllComplaints: async (token: string) => {
    const res = await fetch(`${BASE_URL}/complaints/search?q=`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  },

  // -------------------------
  // NOTIFICATIONS
  // -------------------------
  getUnreadNotifications: async (token: string) => {
    const res = await fetch(`${BASE_URL}/notifications/unread`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  getUnreadCount: async (token: string) => {
    const res = await fetch(`${BASE_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  markNotificationAsRead: async (notificationId: string, token: string) => {
    const res = await fetch(
      `${BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Failed to mark notification as read");
    }

    return json;
  },

  markAllNotificationsAsRead: async (token: string) => {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Failed to mark all notifications as read");
    }

    return json;
  },
};