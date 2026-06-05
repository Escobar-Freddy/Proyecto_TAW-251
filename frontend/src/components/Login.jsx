import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
//import logo from './assets/logo.jpg';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaToken: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');

  // Captcha visual simple (simulado)
  const [captchaText, setCaptchaText] = useState('');
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    return result;
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validar campos vacíos
    if (!formData.email || !formData.password || !formData.captchaToken) {
      setMessage('❌ Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    // Validar CAPTCHA
    if (formData.captchaToken.toUpperCase() !== captchaText) {
      setMessage('❌ Código CAPTCHA incorrecto');
      generateCaptcha();
      setFormData(prev => ({ ...prev, captchaToken: '' }));
      setLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('❌ Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    try {
      // Llamar al endpoint de login de NestJS
      const response = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
        captchaToken: 'test-token' // Token simulado, luego implementar reCAPTCHA real
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.success) {
        setMessage('✅ Login exitoso! Redirigiendo...');
        
        // Guardar token y datos de usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Notificar al componente padre
        setTimeout(() => {
          if (onLogin && typeof onLogin === 'function') {
            onLogin(response.data.user);
          }
          navigate('/dashboard');
        }, 1000);
        
      } else {
        setMessage(`❌ ${response.data.message || 'Error en el login'}`);
        generateCaptcha();
        setFormData(prev => ({ ...prev, captchaToken: '' }));
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('❌ Credenciales incorrectas');
        } else if (error.response.status === 400) {
          setMessage(`❌ ${error.response.data.message || 'Error en la solicitud'}`);
        } else {
          setMessage(`❌ Error del servidor (${error.response.status})`);
        }
      } else if (error.request) {
        setMessage('❌ No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3000');
      } else {
        setMessage('❌ Error al procesar la solicitud');
      }
      
      generateCaptcha();
      setFormData(prev => ({ ...prev, captchaToken: '' }));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'url("/logo.png") center/cover no-repeat, #1c0021',
      padding: '20px'
    },
    loginForm: {
      background: '#f9fad2',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      marginBottom: '10px',
      //color: '#333'
      color:'#25020f'
    },
    subtitle: {
      textAlign: 'center',
      color: '#9e1e4c',
      marginBottom: '30px',
      fontSize: '14px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#25020f'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    captchaContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    captchaDisplay: {
      flex: 1,
      padding: '10px',
      background: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '24px',
      fontWeight: 'bold',
      letterSpacing: '4px',
      textAlign: 'center',
      color: '#8f8f8f',
      fontFamily: 'monospace'
    },
    captchaRefreshBtn: {
      background: 'none',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '18px'
    },
    loginBtn: {
      width: '100%',
      padding: '12px',
      background: '#9e1e4c',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    loginBtnDisabled: {
      backgroundColor: '#bd2f28',
      cursor: 'not-allowed'
    },
    message: {
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '24px',
      textAlign: 'center'
    },
    successMessage: {
      backgroundColor: '#ba4c57',
      color: '#f9fad2',
      border: '1px solid #c3e6cb'
    },
    errorMessage: {
      backgroundColor: '#f9fad2',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    linksContainer: {
      marginTop: '24px',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between'
    },
    link: {
      color: '#bd2f28',
      textDecoration: 'none',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginForm}>
        <h2 style={styles.title}>SISTEMA DE TESORERIA</h2>
        <h2 style={styles.subtitle}>Asambleas de Dios - Distrito 2</h2>
        
        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="asambleasdeDios@gmail.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu contraseña"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Código de Seguridad:</label>
            <div style={styles.captchaContainer}>
              <div style={styles.captchaDisplay}>
                {captchaText}
              </div>
              <button 
                type="button" 
                onClick={() => {
                  generateCaptcha();
                  setFormData(prev => ({ ...prev, captchaToken: '' }));
                }} 
                style={styles.captchaRefreshBtn}
                disabled={loading}
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              name="captchaToken"
              value={formData.captchaToken}
              onChange={handleInputChange}
              required
              placeholder="Ingresa el código de arriba"
              style={{ ...styles.input, textTransform: 'uppercase' }}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.loginBtn,
              ...(loading ? styles.loginBtnDisabled : {})
            }}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#ff1168';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#ff1168';
            }}
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={styles.linksContainer}>
          <Link to="/register" style={styles.link}>📝 Crear cuenta</Link>
          <Link to="/forgot-password" style={styles.link}>🔐 ¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;