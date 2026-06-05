import React from 'react';

function AccessLogEstadisticas({ estadisticas }) {
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1890ff',
    },
    cardLabel: {
      fontSize: '12px',
      color: '#666',
      marginTop: '5px',
    },
    subTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '15px',
      marginBottom: '10px',
      color: '#333',
    },
    topList: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '10px',
    },
    topItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderBottom: '1px solid #eee',
    },
    topNombre: {
      fontWeight: 'bold',
      color: '#333',
    },
    topCantidad: {
      color: '#1890ff',
      fontWeight: 'bold',
    },
  };

  if (!estadisticas) return null;

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardValue}>{estadisticas.total || 0}</div>
          <div style={styles.cardLabel}> Total Accesos</div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.cardValue, color: '#52c41a' }}>{estadisticas.ingresos || 0}</div>
          <div style={styles.cardLabel}> Ingresos</div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.cardValue, color: '#ff4d4f' }}>{estadisticas.salidas || 0}</div>
          <div style={styles.cardLabel}> Salidas</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardValue}>{estadisticas.ultimos7Dias || 0}</div>
          <div style={styles.cardLabel}>📅 Últimos 7 días</div>
        </div>
      </div>

      {estadisticas.topUsuarios && estadisticas.topUsuarios.length > 0 && (
        <>
          <div style={styles.subTitle}>🏆 Top 5 Usuarios más activos</div>
          <div style={styles.topList}>
            {estadisticas.topUsuarios.map((item, index) => (
              <div key={index} style={styles.topItem}>
                <span style={styles.topNombre}>
                  {index + 1}. {item.nombre || `Usuario ID: ${item.id_usuario}`}
                </span>
                <span style={styles.topCantidad}>{item.cantidad} accesos</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AccessLogEstadisticas;