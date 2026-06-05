import React, { useState, useEffect } from 'react';
import { movimientosService, cuentasService } from '../../services/api';

function MovimientosList() {
  const [movimientos, setMovimientos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState(null);
  const [filters, setFilters] = useState({
    fecha_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fecha_fin: new Date().toISOString().split('T')[0],
    tipo: '',
    search: '',
  });
  const [formData, setFormData] = useState({
    id_cuenta: '',
    tipo: 'ingreso',
    monto: '',
    descripcion: '',
    fecha_movimiento: new Date().toISOString().split('T')[0],
    numero_recibo: '',
    persona_origen: '',
    iglesia_origen: '',
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';
  const isTesorero = user.rol === 'tesorero';
  const canEdit = isAdmin || isTesorero; // Admin o Tesorero pueden editar

  useEffect(() => {
    cargarCuentas();
    cargarMovimientos();
  }, [filters]);

  const cargarCuentas = async () => {
    try {
      const response = await cuentasService.getAll();
      setCuentas(response.data);
    } catch (error) {
      console.error('Error cargando cuentas:', error);
    }
  };

  const cargarMovimientos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.fecha_inicio) params.fecha_inicio = filters.fecha_inicio;
      if (filters.fecha_fin) params.fecha_fin = filters.fecha_fin;
      if (filters.tipo) params.tipo = filters.tipo;
      if (filters.search) params.search = filters.search;
      
      const response = await movimientosService.getAll(params);
      const datos = Array.isArray(response.data) ? response.data : [];
      setMovimientos(datos);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        id_usuario_registra: user.id,
        monto: parseFloat(formData.monto) || 0,
      };
      
      if (editingMovimiento) {
        await movimientosService.update(editingMovimiento.id_movimiento, data);
      } else {
        await movimientosService.create(data);
      }
      setShowModal(false);
      setEditingMovimiento(null);
      setFormData({
        id_cuenta: '', tipo: 'ingreso', monto: '', descripcion: '',
        fecha_movimiento: new Date().toISOString().split('T')[0],
        numero_recibo: '', persona_origen: '', iglesia_origen: '',
      });
      cargarMovimientos();
    } catch (error) {
      console.error('Error guardando movimiento:', error);
      alert(error.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este movimiento?')) {
      try {
        await movimientosService.delete(id);
        cargarMovimientos();
      } catch (error) {
        console.error('Error eliminando:', error);
        alert('Error al eliminar el movimiento');
      }
    }
  };

  const handleEdit = (movimiento) => {
    setEditingMovimiento(movimiento);
    setFormData({
      id_cuenta: movimiento.id_cuenta || '',
      tipo: movimiento.tipo || 'ingreso',
      monto: movimiento.monto || '',
      descripcion: movimiento.descripcion || '',
      fecha_movimiento: movimiento.fecha_movimiento ? movimiento.fecha_movimiento.split('T')[0] : new Date().toISOString().split('T')[0],
      numero_recibo: movimiento.numero_recibo || '',
      persona_origen: movimiento.persona_origen || '',
      iglesia_origen: movimiento.iglesia_origen || '',
    });
    setShowModal(true);
  };

  const getTipoColor = (tipo) => tipo === 'ingreso' ? '#52c41a' : '#ff4d4f';

  const formatearMonto = (monto, tipo) => {
    const valor = Number(monto) || 0;
    if (tipo === 'ingreso') {
      return `Bs ${valor.toFixed(2)}`;
    } else {
      return `-Bs ${valor.toFixed(2)}`;
    }
  };

  const styles = {
    container: { marginLeft: '150px', padding: '5px' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    btnPrimary: { padding: '10px 20px', backgroundColor: '#ba4c57', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnPrimaryDisabled: { padding: '10px 20px', backgroundColor: '#ccc', color: '#999', border: 'none', borderRadius: '5px', cursor: 'not-allowed' },
    filtersContainer: { backgroundColor: '#e17572', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' },
    filterGroup: { flex: 1, minWidth: '150px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' },
    input: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' },
    btnFilter: { padding: '8px 20px', backgroundColor: '#ba4c57', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    btnClear: { padding: '8px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    table: { width: '100%', backgroundColor: 'white', borderRadius: '10px', overflow: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    th: { padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: 'white' },
    btnEdit: { padding: '5px 10px', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' },
    btnDelete: { padding: '5px 10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
    btnDisabled: { padding: '5px 10px', backgroundColor: '#ccc', color: '#999', border: 'none', borderRadius: '3px', cursor: 'not-allowed', marginRight: '5px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#f4ead5', padding: '30px', borderRadius: '10px', width: '500px', maxHeight: '80vh', overflow: 'auto' },
    formGroup: { marginBottom: '15px' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
    btnSave: { padding: '10px 20px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    btnCancel: { padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    tipoContainer: { display: 'flex', gap: '20px', marginBottom: '15px' },
    tipoOption: { display: 'flex', alignItems: 'center', gap: '8px' },
    radio: { width: 'auto', marginRight: '5px' },
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>💰 Movimientos</h2>
        {canEdit ? (
          <button style={styles.btnPrimary} onClick={() => {
            setEditingMovimiento(null);
            setFormData({
              id_cuenta: '', tipo: 'ingreso', monto: '', descripcion: '',
              fecha_movimiento: new Date().toISOString().split('T')[0],
              numero_recibo: '', persona_origen: '', iglesia_origen: '',
            });
            setShowModal(true);
          }}>+ Nuevo Movimiento</button>
        ) : (
          <button style={styles.btnPrimaryDisabled} disabled>+ Nuevo Movimiento (Solo Admin/Tesorero)</button>
        )}
      </div>

      {/* Filtros */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Fecha Inicio</label>
          <input type="date" style={styles.input} value={filters.fecha_inicio} onChange={(e) => setFilters({...filters, fecha_inicio: e.target.value})} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Fecha Fin</label>
          <input type="date" style={styles.input} value={filters.fecha_fin} onChange={(e) => setFilters({...filters, fecha_fin: e.target.value})} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Tipo</label>
          <select style={styles.select} value={filters.tipo} onChange={(e) => setFilters({...filters, tipo: e.target.value})}>
            <option value="">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="egreso">Egresos</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Buscar</label>
          <input type="text" style={styles.input} placeholder="Descripción, persona, iglesia..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
        </div>
        <button style={styles.btnFilter} onClick={cargarMovimientos}>Filtrar</button>
        <button style={styles.btnClear} onClick={() => setFilters({ fecha_inicio: '', fecha_fin: '', tipo: '', search: '' })}>Limpiar</button>
      </div>

      {/* Tabla de movimientos */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>N° Recibo</th>
              <th style={styles.th}>Cuenta</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Monto (Bs)</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Persona/Origen</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No hay movimientos registrados en el período seleccionado
                </td>
              </tr>
            ) : (
              movimientos.map((mov) => (
                <tr key={mov.id_movimiento}>
                  <td style={styles.td}>{mov.fecha_movimiento ? new Date(mov.fecha_movimiento).toLocaleDateString('es-ES') : '-'}</td>
                  <td style={styles.td}>{mov.numero_recibo || '-'}</td>
                  <td style={styles.td}>{mov.cuenta?.codigo} - {mov.cuenta?.nombre}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: getTipoColor(mov.tipo) }}>
                      {mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 'bold', color: getTipoColor(mov.tipo) }}>
                    {formatearMonto(mov.monto, mov.tipo)}
                  </td>
                  <td style={styles.td}>{mov.descripcion?.substring(0, 40)}...</td>
                  <td style={styles.td}>{mov.persona_origen || mov.iglesia_origen || '-'}</td>
                  <tr style={styles.tr}>
                    {canEdit ? (
                      <>
                        <button style={styles.btnEdit} onClick={() => handleEdit(mov)}>✏️</button>
                        <button style={styles.btnDelete} onClick={() => handleDelete(mov.id_movimiento)}>🗑️</button>
                      </>
                    ) : (
                      <>
                        <button style={styles.btnDisabled} disabled>Editar</button>
                        <button style={styles.btnDisabled} disabled>Eliminar</button>
                      </>
                    )}
                  </tr>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de creación/edición */}
      {showModal && canEdit && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>{editingMovimiento ? '✏️ Editar Movimiento' : '➕ Nuevo Movimiento'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.tipoContainer}>
                <label style={styles.tipoOption}>
                  <input
                    type="radio"
                    name="tipo"
                    value="ingreso"
                    checked={formData.tipo === 'ingreso'}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value, id_cuenta: ''})}
                    style={styles.radio}
                  />
                  Ingreso
                </label>
                <label style={styles.tipoOption}>
                  <input
                    type="radio"
                    name="tipo"
                    value="egreso"
                    checked={formData.tipo === 'egreso'}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value, id_cuenta: ''})}
                    style={styles.radio}
                  />
                  Egreso
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Cuenta *</label>
                <select
                  value={formData.id_cuenta}
                  onChange={(e) => setFormData({...formData, id_cuenta: parseInt(e.target.value)})}
                  required
                  style={styles.select}
                >
                  <option value="">Seleccionar cuenta</option>
                  {cuentas.filter(c => c.tipo === formData.tipo).map(c => (
                    <option key={c.id_cuenta} value={c.id_cuenta}>{c.codigo} - {c.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Monto (Bs) *</label>
                  <input type="number" step="0.01" value={formData.monto} onChange={(e) => setFormData({...formData, monto: e.target.value})} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fecha *</label>
                  <input type="date" value={formData.fecha_movimiento} onChange={(e) => setFormData({...formData, fecha_movimiento: e.target.value})} required style={styles.input} />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>N° Recibo</label>
                  <input type="text" value={formData.numero_recibo} onChange={(e) => setFormData({...formData, numero_recibo: e.target.value})} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Persona Origen</label>
                  <input type="text" value={formData.persona_origen} onChange={(e) => setFormData({...formData, persona_origen: e.target.value})} style={styles.input} />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Iglesia Origen</label>
                <input type="text" value={formData.iglesia_origen} onChange={(e) => setFormData({...formData, iglesia_origen: e.target.value})} style={styles.input} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea rows="3" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} style={styles.input} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={styles.btnSave}>Guardar</button>
                <button type="button" style={styles.btnCancel} onClick={() => { setShowModal(false); setEditingMovimiento(null); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovimientosList;