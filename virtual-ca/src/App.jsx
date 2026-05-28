import React from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Signup from "./pages/Signup";

import {
  isAuthenticated,
} from "./services/Fakeauth";

// PROTECTED
const ProtectedRoute = ({
  children,
}) => {

  const auth =
    isAuthenticated();

  console.log(
    "IS AUTHENTICATED:",
    auth
  );

  return auth
    ? children
    : <Navigate to="/login" />;
};
function App() {

  return (

    <BrowserRouter>

      <div className="layout">

        <Sidebar />

        <div className="main">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/onboarding"
              element={<Onboarding />}
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;