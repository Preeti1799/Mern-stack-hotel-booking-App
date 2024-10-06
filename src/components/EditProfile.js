// src/components/EditProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Fetch user data to display in the form (optional, if you have an API to fetch user details)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/me"); // Adjust based on your API route
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: "", // Leave empty for security reasons, unless you want to allow password change
        });
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit updated user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/users/me", formData); // Adjust based on your API route
      console.log("Profile updated:", response.data);
      // Optionally redirect user or display success message
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password (optional):</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
