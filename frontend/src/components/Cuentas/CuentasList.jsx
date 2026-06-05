import React, { useState, useEffect } from 'react';
import { cuentasService } from '../../services/api';

function CuentasList() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState(null);
  const [tipos, setTipos] = useState({ ingresos: [], egresos: [] });
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipo: 'ingreso',
    nivel: 1,
    id_cuenta_padre: null,
    descripcion: '',
  });

  // Obtener el rol del usuario actual
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';

  useEffect(() => {
    cargarCuentas();
  }, []);

  const cargarCuentas = async () => {
    try {
      const response = await cuentasService.getAll();
      setCuentas(response.data);

      const ingresos = response.data.filter(c => c.tipo === 'ingreso');
      const egresos = response.data.filter(c => c.tipo === 'egreso');
      setTipos({ ingresos, egresos });
    } catch (error) {
      console.error('Error cargando cuentas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCuenta) {
        await cuentasService.update(editingCuenta.id_cuenta, formData);
      } else {
        await cuentasService.create(formData);
      }
      setShowModal(false);
      setEditingCuenta(null);
      setFormData({
        codigo: '',
        nombre: '',
        tipo: 'ingreso',
        nivel: 1,
        id_cuenta_padre: null,
        descripcion: '',
      });
      cargarCuentas();
    } catch (error) {
      console.error('Error guardando cuenta:', error);
      alert(error.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta cuenta? Las subcuentas también se eliminarán.')) {
      try {
        await cuentasService.delete(id);
        cargarCuentas();
      } catch (error) {
        console.error('Error eliminando:', error);
        alert(error.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  const handleEdit = (cuenta) => {
    setEditingCuenta(cuenta);
    setFormData({
      codigo: cuenta.codigo || '',
      nombre: cuenta.nombre || '',
      tipo: cuenta.tipo || 'ingreso',
      nivel: cuenta.nivel || 1,
      id_cuenta_padre: cuenta.id_cuenta_padre || null,
      descripcion: cuenta.descripcion || '',
    });
    setShowModal(true);
  };

  const getTipoColor = (tipo) => {
    return tipo === 'ingreso' ? '#52c41a' : '#ff4d4f';
  };

  const styles = {
    container: { marginLeft: '250px', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    btnPrimary: { padding: '10px 20px', backgroundColor: '#ba4c57', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnPrimaryDisabled: { padding: '10px 20px', backgroundColor: '#ccc', color: '#999', border: 'none', borderRadius: '5px', cursor: 'not-allowed' },
    table: { width: '100%', backgroundColor: 'white', borderRadius: '10px', overflow: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    th: { padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: 'white' },
    btnEdit: { padding: '5px 10px', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' },
    btnDelete: { padding: '5px 10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
    btnDisabled: { padding: '5px 10px', backgroundColor: '#ccc', color: '#999', border: 'none', borderRadius: '3px', cursor: 'not-allowed', marginRight: '5px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxHeight: '80vh', overflow: 'auto' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', backgroundColor: 'white' },
    textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', minHeight: '80px', resize: 'vertical' },
    btnSave: { padding: '10px 20px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    btnCancel: { padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    nivel0: { marginLeft: '0px' },
    nivel1: { marginLeft: '20px' },
    nivel2: { marginLeft: '40px' },
    nivel3: { marginLeft: '60px' },
  };

  if (loading) {
    return <div style={styles.container}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Plan de Cuentas</h2>
        {isAdmin ? (
          <button style={styles.btnPrimary} onClick={() => {
            setEditingCuenta(null);
            setFormData({
              codigo: '',
              nombre: '',
              tipo: 'ingreso',
              nivel: 1,
              id_cuenta_padre: null,
              descripcion: '',
            });
            setShowModal(true);
          }}>+ Nueva Cuenta</button>
        ) : (
          <button style={styles.btnPrimaryDisabled} disabled>+ Nueva Cuenta (Solo Admin)</button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Nivel</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id_cuenta}>
                <td style={{ ...styles.td, ...(cuenta.nivel === 1 ? styles.nivel0 : cuenta.nivel === 2 ? styles.nivel1 : styles.nivel2) }}>
                  {cuenta.codigo}
                </td>
                <td style={styles.td}>{cuenta.nombre}</td>
                <tr style={styles.tr}>
                  <span style={{ ...styles.badge, backgroundColor: getTipoColor(cuenta.tipo) }}>
                    {cuenta.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                  </span>
                </tr>
                <td style={styles.td}>{cuenta.nivel}</td>
                <td style={styles.td}>{cuenta.descripcion?.substring(0, 50) || '-'}...</td>
                <tr style={styles.tr}>
                  {isAdmin ? (
                    <>
                      <button style={styles.btnEdit} onClick={() => handleEdit(cuenta)}>✏️</button>
                      <button style={styles.btnDelete} onClick={() => handleDelete(cuenta.id_cuenta)}>🗑️</button>
                    </>
                  ) : (
                    <>
                      <button style={styles.btnDisabled} disabled>Editar</button>
                      <button style={styles.btnDisabled} disabled>Eliminar</button>
                    </>
                  )}
                </tr>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar cuenta */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>{editingCuenta ? '✏️ Editar Cuenta' : '➕ Nueva Cuenta'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Código *</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value, id_cuenta_padre: null })}
                  style={styles.select}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cuenta Padre (opcional)</label>
                <select
                  name="id_cuenta_padre"
                  value={formData.id_cuenta_padre || ''}
                  onChange={(e) => setFormData({ ...formData, id_cuenta_padre: e.target.value ? parseInt(e.target.value) : null })}
                  style={styles.select}
                >
                  <option value="">-- Sin padre (Nivel 1) --</option>
                  {(formData.tipo === 'ingreso' ? tipos.ingresos : tipos.egresos)
                    .filter(c => c.nivel === 1 && (!editingCuenta || c.id_cuenta !== editingCuenta.id_cuenta))
                    .map(c => (
                      <option key={c.id_cuenta} value={c.id_cuenta}>{c.codigo} - {c.nombre}</option>
                    ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  value={formData.descripcion || ''}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.btnSave}>Guardar</button>
                <button type="button" style={styles.btnCancel} onClick={() => { setShowModal(false); setEditingCuenta(null); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CuentasList;