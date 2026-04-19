const BASE_URL = "http://localhost:3000";

export const api = {
  // -------------------------
  // AUTH
  // -------------------------
  register: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
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
};