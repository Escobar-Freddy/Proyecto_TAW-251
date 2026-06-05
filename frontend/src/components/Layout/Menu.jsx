import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.rol || 'usuario';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: '📊 Dashboard', roles: ['admin', 'tesorero', 'usuario'] },
    { path: '/usuarios', label: '👥 Usuarios', roles: ['admin'] },
    { path: '/cuentas', label: '📋 Cuentas', roles: ['admin'] },
    { path: '/movimientos', label: '💰 Movimientos', roles: ['admin', 'tesorero'] },
    { path: '/reportes', label: '📄 Reportes', roles: ['admin', 'tesorero', 'usuario'] },
    { path: '/access-logs', label: '📋 Logs de Acceso', roles: ['admin'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  const styles = {
    sidebar: {
      width: '250px',
      backgroundColor: '#25020f',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto',
    },
    logo: {
      padding: '20px',
      textAlign: 'center',
      borderBottom: '1px solid #2c3e50',
      marginBottom: '20px',
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ff1168',
    },
    nav: {
      listStyle: 'none',
      padding: 0,
    },
    navItem: {
      marginBottom: '5px',
      color:'black'
    },
    navLink: {
      display: 'block',
      padding: '12px 20px',
      color: 'white',
      textDecoration: 'none',
      transition: 'background 0.3s',
    },
    navLinkActive: {
      backgroundColor: '#8f8f8f',
    },
    userInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '20px',
      borderTop: '1px solid #2c3e50',
      fontSize: '12px',
    },
    logoutBtn: {
      width: '100%',
      padding: '8px',
      marginTop: '10px',
      backgroundColor: '#ff1168',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoText}>Tesorería</div>
        <div style={{ fontSize: '18px', color: '#999' }}>Asambleas de Dios</div>
      </div>

      <ul style={styles.nav}>
        {visibleItems.map((item) => (
          <li key={item.path} style={styles.navItem}>
            <Link
              to={item.path}
              style={{
                ...styles.navLink,
                ...(isActive(item.path) ? styles.navLinkActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) e.target.style.backgroundColor = '#9e1e4c';
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) e.target.style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={styles.userInfo}>
        <div>👤 {user.nombre || 'Usuario'}</div>
        <div style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
          Rol: {userRole.toUpperCase()}
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Menu;