import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import { logout } from "../services/Fakeauth";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [completion, setCompletion] = useState(0);

  // 📸 IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const updatedUser = { ...user, photo: reader.result };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };

      reader.readAsDataURL(file);
    }
  };

  // ✏️ INPUT CHANGE
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 💾 SAVE
  const saveProfile = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
  };

  // 🔓 LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 📊 PROFILE COMPLETION
  useEffect(() => {
    let score = 0;

    if (user.name) score += 25;
    if (user.email) score += 25;
    if (user.phone) score += 25;
    if (user.photo) score += 25;

    setCompletion(score);
  }, [user]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>

        <div className={styles.card}>

          {/* IMAGE */}
          <div className={styles.imageBox}>
            {user.photo ? (
              <img src={user.photo} alt="profile" />
            ) : (
              <div className={styles.placeholder}>👤</div>
            )}
          </div>

          <input
            type="file"
            className={styles.fileInput}
            onChange={handleImageUpload}
          />

          {/* 📊 COMPLETION */}
          <div className={styles.completion}>
            <p>Profile Completion: {completion}%</p>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* INFO */}
          {isEditing ? (
            <div className={styles.form}>
              <input
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                placeholder="Name"
              />

              <input
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                placeholder="Email"
              />

              <input
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
              />

              <button onClick={saveProfile}>Save</button>
            </div>
          ) : (
            <div className={styles.info}>
              <h2>{user.name || "Your Name"}</h2>
              <p>{user.email || "your@email.com"}</p>
              <p>📞 {user.phone || "Not added"}</p>

              <button onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}

          {/* LOGOUT */}
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile;