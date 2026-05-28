import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {

  // =========================
  // STATES
  // =========================

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOGIN FUNCTION
  // =========================

  const handleLogin = async (e) => {

    e.preventDefault();

    // VALIDATION
    if (!phone || !password) {

      alert(
        "Please enter phone and password"
      );

      return;
    }

    try {

      setLoading(true);

      console.log(
        "SENDING LOGIN..."
      );

      const res = await fetch(
        "https://kartik-money-manager.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            phone: phone.trim(),
            password: password.trim(),
          }),
        }
      );

      const data = await res.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // =========================
      // SUCCESS
      // =========================

      if (data?.token) {

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          data.token
        );

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user || {}
          )
        );

        console.log(
          "TOKEN AFTER SAVE:",
          localStorage.getItem(
            "token"
          )
        );

        // CHECK TOKEN
        const savedToken =
          localStorage.getItem(
            "token"
          );

        if (
          savedToken &&
          savedToken !== "undefined"
        ) {

          alert(
            "Login successful"
          );

          // REDIRECT
          window.location.href =
            "/dashboard";

        } else {

          alert(
            "Token save failed"
          );
        }

      } else {

        alert(
          data?.message ||
            "Invalid credentials"
        );
      }

    } catch (err) {

      console.log(
        "LOGIN ERROR:",
        err
      );

      alert(
        "Server error. Try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="auth-layout">

      <div className="auth-card">

        <h2>Login</h2>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
        >

          {/* PHONE */}
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* SIGNUP */}
        <p
          style={{
            marginTop: "15px",
          }}
        >

          Don’t have an account?
          {" "}

          <Link to="/signup">
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;