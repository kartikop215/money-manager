import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    budget: "",
  });

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      console.log(data);

      // ✅ SUCCESS
      if (data.message === "Signup success" || data.message === "Signup successful") {

        // save budget locally
        localStorage.setItem("budget", JSON.stringify(form.budget));

        alert("Signup successful");

        navigate("/login");

      } else {
        alert(data.message || "Signup failed");
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-layout">
      <h2>Signup</h2>

      <input
        placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Budget"
        onChange={(e) =>
          setForm({ ...form, budget: e.target.value })
        }
      />

      <button onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
}

export default Signup;