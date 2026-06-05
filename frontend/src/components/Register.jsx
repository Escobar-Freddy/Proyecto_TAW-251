import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
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

  // Evaluar fortaleza de contraseña
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar fortaleza de contraseña
    const strength = evaluatePasswordStrength(formData.password);
    if (strength === 'weak') {
      setMessage('❌ La contraseña es débil. Usa al menos 6 caracteres con números y letras');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/usuarios', {
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
        password: formData.password,
        password_strength: strength,
        rol: formData.rol
      });

      if (response.data) {
        setMessage('✅ Usuario registrado exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ Error al registrar usuario');
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
    container: {
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'url("/logo1.png") center/cover no-repeat, #1c0021',
    },
    formContainer: {
      background: '#f9fad2',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    },
    title: {
      textAlign: 'center',
      marginBottom: '10px',
      color: '#25020f'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '15px',
      color:'#9e1e4c'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#9e1e4c'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ff1168',
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box',
      color:'green'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: formData.rol === 'tesorero' ? '#ff1168' : 'white',
      color: formData.rol === 'tesorero' ? '#ff1168' : 'inherit'
    },
    registerBtn: {
      width: '100%',
      padding: '12px',
      background: '#ff1168',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
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
      textAlign: 'center'
    },
    link: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#9e1e4c'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Registro de Usuario</h2>
        
        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Apellido Paterno *</label>
              <input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Apellido Materno *</label>
              <input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Edad *</label>
              <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Celular *</label>
              <input type="text" name="celular" value={formData.celular} onChange={handleInputChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Dirección *</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required style={styles.input} />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Distrito *</label>
              <input type="text" name="distrito" value={formData.distrito} onChange={handleInputChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Región *</label>
              <input type="text" name="region" value={formData.region} onChange={handleInputChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Iglesia *</label>
              <input type="text" name="iglesia" value={formData.iglesia} onChange={handleInputChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Rol *</label>
              <select name="rol" value={formData.rol} onChange={handleInputChange} style={styles.select}>
                <option value="usuario">Usuario</option>
                {/*<option value="tesorero">Tesorero</option>*/}
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contraseña *</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={styles.input} />
              {formData.password && (
                <div style={styles.passwordStrength}>
                  Fortaleza: <strong>{passwordStrength === 'strong' ? '🔒 Fuerte' : passwordStrength === 'medium' ? '⚠️ Intermedia' : '❌ Débil'}</strong>
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirmar Contraseña *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required style={styles.input} />
            </div>
          </div>

          <button type="submit" style={styles.registerBtn} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div style={styles.link}>
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;