import React, { useState } from 'react';

function AccessLogFilters({ filters, onFilterChange, onClearFilters }) {
  const [localFilters, setLocalFilters] = useState({
    fecha_inicio: filters.fecha_inicio || '',
    fecha_fin: filters.fecha_fin || '',
    id_usuario: filters.id_usuario || '',
    evento: filters.evento || '',
    search: filters.search || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      fecha_inicio: '',
      fecha_fin: '',
      id_usuario: '',
      evento: '',
      search: '',
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '15px',
      marginBottom: '15px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#666',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end',
    },
    btnFilter: {
      padding: '8px 20px',
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    btnClear: {
      padding: '8px 20px',
      backgroundColor: '#999',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>🔍 Filtros de Logs de Acceso</div>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>📅 Fecha Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={localFilters.fecha_inicio}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>📅 Fecha Fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={localFilters.fecha_fin}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>🆔 ID Usuario</label>
            <input
              type="number"
              name="id_usuario"
              value={localFilters.id_usuario}
              onChange={handleChange}
              placeholder="Ej: 1"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>🚪 Evento</label>
            <select
              name="evento"
              value={localFilters.evento}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Todos</option>
              <option value="ingreso">Ingreso</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>🔎 Buscar</label>
            <input
              type="text"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="IP, navegador, usuario..."
              style={styles.input}
            />
          </div>
          
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.btnFilter}>
              Filtrar
            </button>
            <button type="button" onClick={handleClear} style={styles.btnClear}>
              Limpiar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AccessLogFilters;