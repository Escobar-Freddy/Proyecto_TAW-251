import React from 'react';

function Header() {
  const styles = {
    header: {
      marginLeft: '250px',
      padding: '15px 30px',
      backgroundColor: '#ececec',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#25020f',
    },
    date: {
      color: '#25020f',
    },
  };

  return (
    <div style={styles.header}>
      <div style={styles.title}>Sistema de Tesorería</div>
      <div style={styles.date}>
        {new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
}

export default Header;