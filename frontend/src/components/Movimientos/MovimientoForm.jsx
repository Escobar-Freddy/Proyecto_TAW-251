import React, { useState, useEffect } from 'react';
import { cuentasService } from '../../services/api';

function MovimientoForm({ movimiento, cuentas, onSave, onCancel }) {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);

  useEffect(() => {
    if (movimiento) {
      setFormData({
        id_cuenta: movimiento.id_cuenta || '',
        tipo: movimiento.tipo || 'ingreso',
        monto: movimiento.monto || '',
        descripcion: movimiento.descripcion || '',
        fecha_movimiento: movimiento.fecha_movimiento?.split('T')[0] || new Date().toISOString().split('T')[0],
        numero_recibo: movimiento.numero_recibo || '',
        persona_origen: movimiento.persona_origen || '',
        iglesia_origen: movimiento.iglesia_origen || '',
      });
    }
  }, [movimiento]);

  useEffect(() => {
    // Filtrar cuentas según el tipo seleccionado
    setCuentasFiltradas(cuentas.filter(c => c.tipo === formData.tipo));
  }, [formData.tipo, cuentas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id_cuenta) newErrors.id_cuenta = 'Seleccione una cuenta';
    if (!formData.monto) newErrors.monto = 'El monto es requerido';
    else if (parseFloat(formData.monto) <= 0) newErrors.monto = 'El monto debe ser mayor a 0';
    if (!formData.fecha_movimiento) newErrors.fecha_movimiento = 'La fecha es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const dataToSave = {
        ...formData,
        id_usuario_registra: user.id,
        monto: parseFloat(formData.monto),
      };
      onSave(dataToSave);
    } catch (error) {
      console.error('Error en validación:', error);
      setLoading(false);
    }
  };

  const styles = {
    form: { width: '100%' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333', fontSize: '13px' },
    required: { color: '#ff4d4f', marginLeft: '4px' },
    input: { 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    inputError: { borderColor: '#ff4d4f' },
    select: { 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    textarea: { 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '5px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical'
    },
    errorText: { color: '#ff4d4f', fontSize: '12px', marginTop: '5px' },
    tipoContainer: { display: 'flex', gap: '20px', marginBottom: '15px' },
    tipoOption: { display: 'flex', alignItems: 'center', gap: '8px' },
    radio: { width: 'auto', marginRight: '5px' },
    buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    btnSave: { 
      padding: '10px 24px', 
      backgroundColor: '#52c41a', 
      color: 'white', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    btnCancel: { 
      padding: '10px 24px', 
      backgroundColor: '#999', 
      color: 'white', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: 'pointer',
      fontSize: '14px'
    },
    btnSaveDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
    infoBox: {
      backgroundColor: '#e6f7ff',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '12px',
      color: '#1890ff'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.infoBox}>
        💡 Complete los datos del movimiento. Los campos marcados con * son obligatorios.
      </div>

      <div style={styles.tipoContainer}>
        <label style={styles.tipoOption}>
          <input
            type="radio"
            name="tipo"
            value="ingreso"
            checked={formData.tipo === 'ingreso'}
            onChange={handleChange}
            style={styles.radio}
          />
          💰 Ingreso
        </label>
        <label style={styles.tipoOption}>
          <input
            type="radio"
            name="tipo"
            value="egreso"
            checked={formData.tipo === 'egreso'}
            onChange={handleChange}
            style={styles.radio}
          />
          💸 Egreso
        </label>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Cuenta <span style={styles.required}>*</span></label>
        <select
          name="id_cuenta"
          value={formData.id_cuenta}
          onChange={handleChange}
          style={{ ...styles.select, ...(errors.id_cuenta ? styles.inputError : {}) }}
        >
          <option value="">Seleccionar cuenta</option>
          {cuentasFiltradas.map(c => (
            <option key={c.id_cuenta} value={c.id_cuenta}>
              {c.codigo} - {c.nombre}
            </option>
          ))}
        </select>
        {errors.id_cuenta && <div style={styles.errorText}>{errors.id_cuenta}</div>}
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Monto (Bs) <span style={styles.required}>*</span></label>
          <input
            type="number"
            step="0.01"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            placeholder="0.00"
            style={{ ...styles.input, ...(errors.monto ? styles.inputError : {}) }}
          />
          {errors.monto && <div style={styles.errorText}>{errors.monto}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha <span style={styles.required}>*</span></label>
          <input
            type="date"
            name="fecha_movimiento"
            value={formData.fecha_movimiento}
            onChange={handleChange}
            style={{ ...styles.input, ...(errors.fecha_movimiento ? styles.inputError : {}) }}
          />
          {errors.fecha_movimiento && <div style={styles.errorText}>{errors.fecha_movimiento}</div>}
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>N° Recibo</label>
          <input
            type="text"
            name="numero_recibo"
            value={formData.numero_recibo}
            onChange={handleChange}
            placeholder="Opcional"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Persona Origen</label>
          <input
            type="text"
            name="persona_origen"
            value={formData.persona_origen}
            onChange={handleChange}
            placeholder="Para diezmos/ofrendas"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Iglesia Origen</label>
        <input
          type="text"
          name="iglesia_origen"
          value={formData.iglesia_origen}
          onChange={handleChange}
          placeholder="Para diezmos de regiones"
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción detallada del movimiento..."
          style={styles.textarea}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button type="button" onClick={onCancel} style={styles.btnCancel} disabled={loading}>
          Cancelar
        </button>
        <button 
          type="submit" 
          style={{ ...styles.btnSave, ...(loading ? styles.btnSaveDisabled : {}) }}
          disabled={loading}
        >
          {loading ? 'Guardando...' : (movimiento ? 'Actualizar' : 'Crear Movimiento')}
        </button>
      </div>
    </form>
  );
}

export default MovimientoForm;