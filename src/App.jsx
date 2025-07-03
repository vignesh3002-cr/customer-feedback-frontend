import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const BACKEND_URL = "https://customer-feedback-backend-ozgw.onrender.com";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    rating: 5,
    comments: ""
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/submit-feedback`, form);
      alert("Feedback submitted!");
      setForm({ name: "", email: "", service: "", rating: 5, comments: "" });
    } catch (err) {
      alert("Submission failed. Please try again.");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/admin-login`, adminForm);
      if (res.data.success) {
        setIsAdmin(true);
        const feedbackRes = await axios.get(`${BACKEND_URL}/all-feedback`);
        setFeedbacks(feedbackRes.data);
      } else {
        alert("Invalid admin credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
   <div id="head_container">
    <h1 id="heading">Pixellium</h1>
    <div className="container">
      <h1>Customer Feedback</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <select name="service" value={form.service} onChange={handleChange} required>
          <option value="">Select a service</option>
          <option>Web Development</option>
          <option>Branding</option>
          <option>Digital Marketing</option>
          <option>Cybersecurity</option>
        </select>
        <input type="number" name="rating" min="1" max="5" value={form.rating} onChange={handleChange} required />
        <textarea name="comments" value={form.comments} onChange={handleChange} placeholder="Comments" />
        <button type="submit">Submit Feedback</button>
      </form>
      <img src="../danger.webp" id="danger"></img>
      <button id="adlog" onClick={() => setShowAdminLogin(!showAdminLogin)} style={{ marginTop: "20px" }}>
       {showAdminLogin ? "Hide Admin Login" : " For Admin Use Only"}
      </button>
      <img src="../arrow.gif" id="arrow"></img>
      

      {showAdminLogin && !isAdmin && (
        <form onSubmit={handleAdminLogin} style={{ marginTop: "5px" }}>
          <input
            name="username"
            placeholder="Admin Username"
            value={adminForm.username}
            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}

      {isAdmin && showAdminLogin && (
        <div>
          <h2>All Feedback</h2>
          <ul>
            {feedbacks.map((fb, idx) => (
              <li key={idx}>
                <strong>{fb.name}</strong> ({fb.service} - {fb.rating}★): {fb.comments}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}