// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const isAuthenticated = () => {
  return !!localStorage.getItem('userInfo');
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Renders child routes
};

function App() {
  return (
    <> {/* Using a fragment as the outermost element if no global wrapper div is needed here */}
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;