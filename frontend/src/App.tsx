import { useState, useEffect } from "react";
import { api } from "./api";

export default function App() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState<string>("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [my, setMy] = useState<any[]>([]);
  const [pub, setPub] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  // -------------------------
  // REGISTER
  // -------------------------
  const handleRegister = async () => {
    const res = await api.register(email, password);

    alert(res.message || "Registered");

    setMode("login");
  };

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = async () => {
    const res = await api.login(email, password);

    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      alert("Login success");
    } else {
      alert(res.message || "Login failed");
    }
  };

  // -------------------------
  // CREATE COMPLAINT
  // -------------------------
  const create = async () => {
    const res = await api.createComplaint(
      { title, description },
      token
    );

    alert("Created");
    console.log(res);
  };

  // -------------------------
  // LOAD MY
  // -------------------------
  const loadMy = async () => {
    const res = await api.getMy(token);
    setMy(res);
  };

  // -------------------------
  // LOAD PUBLIC
  // -------------------------
  const loadPublic = async () => {
    const res = await api.getPublic();
    setPub(res);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Complaint System</h1>

      {/* AUTH SWITCH */}
      {!token && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setMode("login")}>Login</button>
          <button onClick={() => setMode("register")}>Register</button>

          <h2>{mode.toUpperCase()}</h2>

          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          {mode === "login" ? (
            <button onClick={handleLogin}>Login</button>
          ) : (
            <button onClick={handleRegister}>Register</button>
          )}
        </div>
      )}

      {/* LOGGED IN UI */}
      {token && (
        <>
          <h2>Create Complaint</h2>

          <input
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />

          <textarea
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <br />

          <button onClick={create}>Create</button>

          <hr />

          <button onClick={loadMy}>My Complaints</button>
          <button onClick={loadPublic}>Public</button>

          <h3>My Complaints</h3>
          {my.map((c) => (
            <div key={c.id}>
              <b>{c.title}</b>
              <p>{c.status}</p>
            </div>
          ))}

          <h3>Public Complaints</h3>
          {pub.map((c) => (
            <div key={c.id}>
              <b>{c.title}</b>
            </div>
          ))}
        </>
      )}
    </div>
  );
}