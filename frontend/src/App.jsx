import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Layout/Menu';
import Header from './components/Layout/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UsuariosList from './components/Usuarios/UsuariosList';
import CuentasList from './components/Cuentas/CuentasList';
import MovimientosList from './components/Movimientos/MovimientosList';
import Reportes from './components/Reportes/Reportes';
import AccessLogsList from './components/AccessLogs/AccessLogsList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Menu />
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<UsuariosList />} />
        <Route path="/cuentas" element={<CuentasList />} />
        <Route path="/movimientos" element={<MovimientosList />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/access-logs" element={<AccessLogsList />} />
      </Routes>
    </Router>
  );
}

export default App;