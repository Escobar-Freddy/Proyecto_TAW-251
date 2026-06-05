import React, { useState, useEffect } from 'react';
import { accessLogsService } from '../../services/api';
import AccessLogFilters from './AccessLogFilters';
import AccessLogEstadisticas from './AccessLogEstadisticas';

function AccessLogsList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filters, setFilters] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    id_usuario: '',
    evento: '',
    search: '',
  });

  useEffect(() => {
    cargarLogs();
    cargarEstadisticas();
  }, []);

  const cargarLogs = async (filtros = filters) => {
  setLoading(true);
  try {
    const params = {};
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio;
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin;
    if (filtros.id_usuario) params.id_usuario = filtros.id_usuario;
    if (filtros.evento) params.evento = filtros.evento;
    if (filtros.search) params.search = filtros.search;
    
    const response = await accessLogsService.getAll(params);
    setLogs(response.data);
  } catch (error) {
    console.error('Error cargando logs:', error);
    if (error.response?.status === 403) {
      alert('No tiene permisos para ver los logs de acceso. Se requiere rol de administrador.');
    } else if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor inicie sesión nuevamente.');
      window.location.href = '/login';
    } else {
      alert('Error al cargar los logs');
    }
  } finally {
    setLoading(false);
  }
};

const cargarEstadisticas = async () => {
  try {
    const response = await accessLogsService.getEstadisticas();
    setEstadisticas(response.data);
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    if (error.response?.status === 403) {
      // No mostrar alerta aquí, solo log
      console.log('No hay permisos para ver estadísticas');
    }
  }
};
  const handleFilterChange = (nuevosFiltros) => {
    setFilters(nuevosFiltros);
    cargarLogs(nuevosFiltros);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      fecha_inicio: '',
      fecha_fin: '',
      id_usuario: '',
      evento: '',
      search: '',
    };
    setFilters(emptyFilters);
    cargarLogs(emptyFilters);
  };

  const getEventoColor = (evento) => {
    return evento === 'ingreso' ? '#52c41a' : '#ff4d4f';
  };

  const getEventoIcono = (evento) => {
    return evento === 'ingreso' ? '🔓' : '🔒';
  };

  const styles = {
    container: {
      marginLeft: '150px',
      padding: '5px',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px',
    },
    table: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      fontWeight: 'bold',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #eee',
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
      display: 'inline-block',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '10px',
    },
    emptyContainer: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '10px',
      color: '#999',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>Cargando logs de acceso...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Logs de Acceso</h2>
        <p style={styles.subtitle}>
          Historial de ingresos y salidas del sistema
        </p>
      </div>

      {/* Estadísticas */}
      <AccessLogEstadisticas estadisticas={estadisticas} />

      {/* Filtros */}
      <AccessLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Tabla de logs */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Usuario</th>
              <th style={styles.th}>Evento</th>
              <th style={styles.th}>IP</th>
              <th style={styles.th}>Navegador</th>
              <th style={styles.th}>Fecha/Hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyContainer}>
                  No hay registros de acceso en el período seleccionado
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id_log}>
                  <td style={styles.td}>{log.id_log}</td>
                  <td style={styles.td}>
                    <strong>{log.usuario?.nombre || 'N/A'}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{log.usuario?.email}</small>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: getEventoColor(log.evento),
                      }}
                    >
                      {getEventoIcono(log.evento)} {log.evento === 'ingreso' ? 'Ingreso' : 'Salida'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <code>{log.ip}</code>
                  </td>
                  <td style={styles.td}>
                    <div style={{ maxWidth: '250px', wordBreak: 'break-all' }}>
                      {log.browser?.substring(0, 60)}...
                    </div>
                  </td>
                  <td style={styles.td}>
                    {new Date(log.fecha_hora).toLocaleString('es-ES')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccessLogsList;