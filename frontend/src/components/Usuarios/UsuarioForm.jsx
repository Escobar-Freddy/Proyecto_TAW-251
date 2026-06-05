import React, { useState, useEffect } from 'react';
import { usuariosService } from '../../services/api';

function UsuarioForm({ usuario, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    direccion: '',
    celular: '',
    edad: '',
    distrito: '',
    region: '',
    iglesia: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'usuario'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const evaluatePasswordStrength = (password) => {
    let strength = 'weak';
    if (password.length >= 6) {
      if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) {
        strength = 'medium';
      }
      if (/[0-9]/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = 'strong';
      }
    }
    setPasswordStrength(strength);
    return strength;
  };

  useEffect(() => {
    if (usuario) {
      // Solo cargar los campos editables, excluyendo campos automáticos
      setFormData({
        nombre: usuario.nombre || '',
        apellido_paterno: usuario.apellido_paterno || '',
        apellido_materno: usuario.apellido_materno || '',
        direccion: usuario.direccion || '',
        celular: usuario.celular || '',
        edad: usuario.edad || '',
        distrito: usuario.distrito || '',
        region: usuario.region || '',
        iglesia: usuario.iglesia || '',
        email: usuario.email || '',
        password: '',
        confirmPassword: '',
        rol: usuario.rol || 'usuario',
      });
    }
  }, [usuario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validar contraseñas
    if (!usuario && !formData.password) {
      setMessage('❌ La contraseña es requerida');
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar fortaleza de contraseña
    if (formData.password) {
      const strength = evaluatePasswordStrength(formData.password);
      if (strength === 'weak') {
        setMessage('❌ La contraseña es débil. Usa al menos 6 caracteres con números y letras');
        setLoading(false);
        return;
      }
    }

    try {
      // Construir objeto SOLO con los campos permitidos
      const dataToSave = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        direccion: formData.direccion,
        celular: formData.celular,
        edad: parseInt(formData.edad),
        distrito: formData.distrito,
        region: formData.region,
        iglesia: formData.iglesia,
        email: formData.email,
        rol: formData.rol
      };

      // Agregar password solo si se proporcionó
      if (formData.password) {
        const strength = evaluatePasswordStrength(formData.password);
        dataToSave.password = formData.password;
        dataToSave.password_strength = strength;
      }

      if (usuario) {
        await usuariosService.update(usuario.id_usuario, dataToSave);
        setMessage('✅ Usuario actualizado exitosamente');
        setTimeout(() => {
          onSave();
        }, 1500);
      } else {
        await usuariosService.create(dataToSave);
        setMessage('✅ Usuario registrado exitosamente');
        setTimeout(() => {
          onSave();
        }, 1500);
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ Error al guardar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'strong') return '#52c41a';
    if (passwordStrength === 'medium') return '#faad14';
    return '#ff4d4f';
  };

  const styles = {
    form: { width: '100%', color:'#e8bf56', backgroundColor:'#ffe4aa' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
    formGroup: { marginBottom: '5px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#452632', fontSize: '13px' },
    required: { color: '#ff4d4f', marginLeft: '4px' },
    input: { 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ce1446', 
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    select: { 
      width: '100%', 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: '#e17572'
    },
    passwordStrength: {
      marginTop: '5px',
      fontSize: '12px',
      color: getStrengthColor()
    },
    message: {
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    buttonContainer: { 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: '10px', 
      marginTop: '20px', 
      color:'red'
    },
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
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre <span style={styles.required}>*</span></label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Apellido Paterno <span style={styles.required}>*</span></label>
          <input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Apellido Materno <span style={styles.required}>*</span></label>
          <input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Edad <span style={styles.required}>*</span></label>
          <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Celular <span style={styles.required}>*</span></label>
          <input type="text" name="celular" value={formData.celular} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email <span style={styles.required}>*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Dirección <span style={styles.required}>*</span></label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required style={styles.input} disabled={loading} />
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Distrito <span style={styles.required}>*</span></label>
          <input type="text" name="distrito" value={formData.distrito} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Región <span style={styles.required}>*</span></label>
          <input type="text" name="region" value={formData.region} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Iglesia <span style={styles.required}>*</span></label>
          <input type="text" name="iglesia" value={formData.iglesia} onChange={handleInputChange} required style={styles.input} disabled={loading} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Rol <span style={styles.required}>*</span></label>
          <select name="rol" value={formData.rol} onChange={handleInputChange} style={styles.select} disabled={loading}>
            <option value="usuario">Usuario</option>
            <option value="tesorero">Tesorero</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Contraseña {!usuario && <span style={styles.required}>*</span>}
          </label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
            required={!usuario}
            style={styles.input} 
            disabled={loading}
            placeholder={!usuario ? "Ingrese contraseña" : "Dejar en blanco para no cambiar"}
          />
          {formData.password && (
            <div style={styles.passwordStrength}>
              Fortaleza: <strong>{passwordStrength === 'strong' ? '🔒 Fuerte' : passwordStrength === 'medium' ? '⚠️ Intermedia' : '❌ Débil'}</strong>
            </div>
          )}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Confirmar Contraseña</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleInputChange} 
            required={!usuario && !!formData.password}
            style={styles.input} 
            disabled={loading} 
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '5px' }}>
              ⚠️ Las contraseñas no coinciden
            </div>
          )}
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button type="button" onClick={onCancel} style={styles.btnCancel} disabled={loading}>
          Cancelar
        </button>
        <button 
          type="submit" 
          style={{ 
            ...styles.btnSave, 
            ...(loading ? styles.btnSaveDisabled : {}) 
          }} 
          disabled={loading}
        >
          {loading ? 'Guardando...' : (usuario ? 'Actualizar Usuario' : 'Crear Usuario')}
        </button>
      </div>
    </form>
  );
}

export default UsuarioForm;