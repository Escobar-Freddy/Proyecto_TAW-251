import React, { useState, useEffect } from 'react';
import { usuariosService } from '../../services/api';
import UsuarioForm from './UsuarioForm';

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Obtener el rol del usuario actual
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await usuariosService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    const cleanUser = {
      id_usuario: user.id_usuario,
      nombre: user.nombre || '',
      apellido_paterno: user.apellido_paterno || '',
      apellido_materno: user.apellido_materno || '',
      direccion: user.direccion || '',
      celular: user.celular || '',
      edad: user.edad || '',
      distrito: user.distrito || '',
      region: user.region || '',
      iglesia: user.iglesia || '',
      email: user.email || '',
      rol: user.rol || 'usuario',
    };
    setEditingUser(cleanUser);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
      try {
        await usuariosService.delete(id);
        cargarUsuarios();
      } catch (error) {
        console.error('Error eliminando:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingUser(null);
    cargarUsuarios();
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const styles = {
    container: { marginLeft: '250px', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    btnPrimary: { padding: '10px 20px', backgroundColor: '#ba4c57', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnPrimaryDisabled: { padding: '10px 20px', backgroundColor: '#ff1168', color: '#999', border: 'none', borderRadius: '5px', cursor: 'not-allowed' },
    table: { width: '100%', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    th: { padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: 'white' },
    btnEdit: { padding: '5px 10px', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' },
    btnDelete: { padding: '5px 10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
    btnDisabled: { padding: '5px 10px', backgroundColor: '#ccc', color: '#999', border: 'none', borderRadius: '3px', cursor: 'not-allowed', marginRight: '5px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '600px', maxHeight: '80vh', overflow: 'auto' },
  };

  const getRolColor = (rol) => {
    if (rol === 'admin') return '#1890ff';
    if (rol === 'tesorero') return '#52c41a';
    return '#faad14';
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  // Si no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '10px' }}>
          <h3>⛔ Acceso Denegado</h3>
          <p>No tienes permisos para gestionar usuarios. Solo el administrador puede acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 Usuarios</h2>
        <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>+ Nuevo Usuario</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.filter(u => u.activo).map((userItem) => (
              <tr key={userItem.id_usuario}>
                <td style={styles.td}>{userItem.id_usuario}</td>
                <td style={styles.td}>{userItem.nombre} {userItem.apellido_paterno}</td>
                <td style={styles.td}>{userItem.email}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: getRolColor(userItem.rol) }}>
                    {userItem.rol === 'admin' ? '👑 Admin' : userItem.rol === 'tesorero' ? '💰 Tesorero' : '👤 Usuario'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: userItem.activo ? '#52c41a' : '#999' }}>
                    {userItem.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <tr style={styles.td}>
                  <button style={styles.btnEdit} onClick={() => handleEdit(userItem)}>✏️</button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(userItem.id_usuario)}>🗑️</button>
                </tr>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <UsuarioForm 
              usuario={editingUser} 
              onSave={handleSave} 
              onCancel={handleCancel} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosList;