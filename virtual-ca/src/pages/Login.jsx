import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!phone || !password) {

      alert("Enter phone and password");
      return;
    }

    try {

      const res = await fetch(
        "https://kartik-money-manager.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      // ✅ LOGIN SUCCESS
      if (data.token) {

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          data.token
        );

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        console.log(
          "TOKEN SAVED:",
          localStorage.getItem("token")
        );

        alert("Login success");

        // SMALL DELAY
        setTimeout(() => {

          navigate("/dashboard");

        }, 500);

      } else {

        alert(
          data.message ||
          "Login failed"
        );
      }

    } catch (err) {

      console.log(err);

      alert("Server error");
    }
  };

  return (

    <div className="auth-layout">

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;