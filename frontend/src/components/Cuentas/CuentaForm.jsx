import React, { useState, useEffect } from 'react';
import { cuentasService } from '../../services/api';

function CuentaForm({ cuenta, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipo: 'ingreso',
    nivel: 1,
    id_cuenta_padre: null,
    descripcion: '',
  });
  const [cuentasPadre, setCuentasPadre] = useState({ ingresos: [], egresos: [] });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarCuentasPadre();
    if (cuenta) {
      setFormData({
        codigo: cuenta.codigo || '',
        nombre: cuenta.nombre || '',
        tipo: cuenta.tipo || 'ingreso',
        nivel: cuenta.nivel || 1,
        id_cuenta_padre: cuenta.id_cuenta_padre || null,
        descripcion: cuenta.descripcion || '',
      });
    }
  }, [cuenta]);

  const cargarCuentasPadre = async () => {
    try {
      const response = await cuentasService.getAll();
      const cuentas = response.data;
      
      // Separar cuentas por tipo y excluir cuentas de nivel 3 (no pueden tener más hijos)
      const ingresos = cuentas.filter(c => c.tipo === 'ingreso' && c.nivel < 3 && (!cuenta || c.id_cuenta !== cuenta.id_cuenta));
      const egresos = cuentas.filter(c => c.tipo === 'egreso' && c.nivel < 3 && (!cuenta || c.id_cuenta !== cuenta.id_cuenta));
      
      setCuentasPadre({ ingresos, egresos });
    } catch (error) {
      console.error('Error cargando cuentas padre:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (formData.codigo.length > 10) newErrors.codigo = 'El código no puede tener más de 10 caracteres';
    if (formData.nombre.length > 150) newErrors.nombre = 'El nombre no puede tener más de 150 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        nivel: formData.id_cuenta_padre ? null : 1, // El backend calculará el nivel
      };
      
      if (cuenta) {
        await cuentasService.update(cuenta.id_cuenta, dataToSave);
      } else {
        await cuentasService.create(dataToSave);
      }
      onSave();
    } catch (error) {
      console.error('Error guardando cuenta:', error);
      alert(error.response?.data?.message || 'Error al guardar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_cuenta_padre' ? (value ? parseInt(value) : null) : value
    }));
    // Limpiar error del campo
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getNivelSiguiente = () => {
    if (!formData.id_cuenta_padre) return 1;
    const padre = [...cuentasPadre.ingresos, ...cuentasPadre.egresos].find(c => c.id_cuenta === formData.id_cuenta_padre);
    return padre ? padre.nivel + 1 : 2;
  };

  const styles = {
    form: { width: '100%', backgroundColor:'red' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'red' },
    required: { color: '#ff4d4f', marginLeft: '4px' },
    input: { 
      width: '100%', 
      padding: '10px', 
      border: '1px solid red', 
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s'
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
    infoText: { color: '#666', fontSize: '12px', marginTop: '5px', fontStyle: 'italic' },
    buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    btnSave: { 
      padding: '10px 24px', 
      backgroundColor: '#ba4c57', 
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
    tipoContainer: { display: 'flex', gap: '18px' },
    tipoOption: { display: 'flex', alignItems: 'center', gap: '8px' },
    radio: { width: 'auto', marginRight: '5px' },
    nivelBadge: { 
      display: 'inline-block', 
      padding: '4px 10px', 
      backgroundColor: '#e6f7ff', 
      color: '#1890ff',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Tipo de Cuenta <span style={styles.required}>*</span>
        </label>
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
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Código <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          placeholder="Ej: 300, 310, 320"
          style={{ ...styles.input, ...(errors.codigo ? styles.inputError : {}) }}
          disabled={loading}
        />
        {errors.codigo && <div style={styles.errorText}>{errors.codigo}</div>}
        <div style={styles.infoText}>Máximo 10 caracteres. Ej: 300 para Diezmos</div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Nombre <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: DIEZMOS, OFRENDAS, GASTOS MINISTERIALES"
          style={{ ...styles.input, ...(errors.nombre ? styles.inputError : {}) }}
          disabled={loading}
        />
        {errors.nombre && <div style={styles.errorText}>{errors.nombre}</div>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Cuenta Padre (opcional)</label>
        <select
          name="id_cuenta_padre"
          value={formData.id_cuenta_padre || ''}
          onChange={handleChange}
          style={styles.select}
          disabled={loading}
        >
          <option value="">-- Sin padre (Nivel 1) --</option>
          {(formData.tipo === 'ingreso' ? cuentasPadre.ingresos : cuentasPadre.egresos).map(c => (
            <option key={c.id_cuenta} value={c.id_cuenta}>
              {c.codigo} - {c.nombre} (Nivel {c.nivel})
            </option>
          ))}
        </select>
        <div style={styles.infoText}>
          Nivel que tendrá esta cuenta: <span style={styles.nivelBadge}>Nivel {getNivelSiguiente()}</span>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción detallada de la cuenta..."
          style={styles.textarea}
          disabled={loading}
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
          {loading ? 'Guardando...' : (cuenta ? 'Actualizar' : 'Crear Cuenta')}
        </button>
      </div>
    </form>
  );
}

export default CuentaForm;