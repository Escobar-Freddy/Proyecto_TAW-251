import React, { useState } from 'react';

function UsuarioCard({ usuario, onEdit, onDelete, isSelected, onSelect }) {
  const [showDetails, setShowDetails] = useState(false);

  const getRolColor = (rol) => {
    if (rol === 'admin') return '#1890ff';
    if (rol === 'tesorero') return '#52c41a';
    return '#faad14';
  };

  const getRolIcon = (rol) => {
    if (rol === 'admin') return '👑';
    if (rol === 'tesorero') return '💰';
    return '👤';
  };

  const getInitials = () => {
    return `${usuario.nombre?.charAt(0) || ''}${usuario.apellido_paterno?.charAt(0) || ''}`;
  };

  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: isSelected ? '0 0 0 2px #1890ff' : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s',
      cursor: 'pointer',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
    },
    avatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: getRolColor(usuario.rol),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
    },
    info: { flex: 1 },
    name: { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
    email: { fontSize: '12px', color: '#666', marginBottom: '4px' },
    rol: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: 'bold',
      backgroundColor: getRolColor(usuario.rol) + '20',
      color: getRolColor(usuario.rol),
    },
    status: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: 'bold',
      marginLeft: '8px',
      backgroundColor: usuario.activo ? '#52c41a20' : '#ff4d4f20',
      color: usuario.activo ? '#52c41a' : '#ff4d4f',
    },
    details: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #eee',
      fontSize: '12px',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    detailLabel: { fontWeight: 'bold', color: '#666' },
    detailValue: { color: '#333' },
    buttonContainer: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
      justifyContent: 'flex-end',
    },
    btnEdit: {
      padding: '6px 12px',
      backgroundColor: '#faad14',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    btnDelete: {
      padding: '6px 12px',
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.card} onClick={onSelect}>
      <div style={styles.cardHeader}>
        <div style={styles.avatar}>{getInitials()}</div>
        <div style={styles.info}>
          <div style={styles.name}>
            {usuario.nombre} {usuario.apellido_paterno}
          </div>
          <div style={styles.email}>{usuario.email}</div>
          <div>
            <span style={styles.rol}>
              {getRolIcon(usuario.rol)} {usuario.rol?.toUpperCase()}
            </span>
            <span style={styles.status}>
              {usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Celular:</span>
            <span style={styles.detailValue}>{usuario.celular || '-'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Edad:</span>
            <span style={styles.detailValue}>{usuario.edad || '-'} años</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Iglesia:</span>
            <span style={styles.detailValue}>{usuario.iglesia || '-'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Distrito/Región:</span>
            <span style={styles.detailValue}>{usuario.distrito} / {usuario.region}</span>
          </div>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button 
          style={styles.btnEdit} 
          onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
        >
          {showDetails ? 'Ocultar' : 'Ver más'}
        </button>
        <button 
          style={styles.btnEdit} 
          onClick={(e) => { e.stopPropagation(); onEdit(usuario); }}
        >
          Editar
        </button>
        <button 
          style={styles.btnDelete} 
          onClick={(e) => { e.stopPropagation(); onDelete(usuario.id_usuario); }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default UsuarioCard;