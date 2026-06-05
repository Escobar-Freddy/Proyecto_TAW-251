import React, { useState, useEffect } from 'react';
import { cuentasService } from '../../services/api';

function MovimientoFilters({ filters, onFilterChange, onClearFilters }) {
  const [cuentas, setCuentas] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    fecha_inicio: filters.fecha_inicio || '',
    fecha_fin: filters.fecha_fin || '',
    tipo: filters.tipo || '',
    id_cuenta: filters.id_cuenta || '',
    search: filters.search || '',
  });

  useEffect(() => {
    cargarCuentas();
  }, []);

  useEffect(() => {
    setLocalFilters({
      fecha_inicio: filters.fecha_inicio || '',
      fecha_fin: filters.fecha_fin || '',
      tipo: filters.tipo || '',
      id_cuenta: filters.id_cuenta || '',
      search: filters.search || '',
    });
  }, [filters]);

  const cargarCuentas = async () => {
    try {
      const response = await cuentasService.getAll();
      setCuentas(response.data);
    } catch (error) {
      console.error('Error cargando cuentas:', error);
    }
  };

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
      tipo: '',
      id_cuenta: '',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
      transition: 'border-color 0.3s',
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
    activeFilters: {
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '1px solid #eee',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      alignItems: 'center',
    },
    filterBadge: {
      padding: '4px 10px',
      backgroundColor: '#e6f7ff',
      borderRadius: '20px',
      fontSize: '12px',
      color: '#1890ff',
    },
    clearBadge: {
      cursor: 'pointer',
      marginLeft: '5px',
      fontWeight: 'bold',
    },
  };

  const hasActiveFilters = () => {
    return localFilters.fecha_inicio || localFilters.fecha_fin || 
           localFilters.tipo || localFilters.id_cuenta || localFilters.search;
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>🔍 Filtros de Búsqueda</div>
      
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
            <label style={styles.label}>💰 Tipo</label>
            <select
              name="tipo"
              value={localFilters.tipo}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Todos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>📋 Cuenta</label>
            <select
              name="id_cuenta"
              value={localFilters.id_cuenta}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Todas las cuentas</option>
              <optgroup label="📈 Ingresos">
                {cuentas.filter(c => c.tipo === 'ingreso').map(c => (
                  <option key={c.id_cuenta} value={c.id_cuenta}>
                    {c.codigo} - {c.nombre}
                  </option>
                ))}
              </optgroup>
              <optgroup label="📉 Egresos">
                {cuentas.filter(c => c.tipo === 'egreso').map(c => (
                  <option key={c.id_cuenta} value={c.id_cuenta}>
                    {c.codigo} - {c.nombre}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>🔎 Buscar</label>
            <input
              type="text"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="Descripción, persona, iglesia..."
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

      {hasActiveFilters() && (
        <div style={styles.activeFilters}>
          <span style={{ fontSize: '12px', color: '#666' }}>Filtros activos:</span>
          {localFilters.fecha_inicio && (
            <span style={styles.filterBadge}>
              Desde: {localFilters.fecha_inicio}
            </span>
          )}
          {localFilters.fecha_fin && (
            <span style={styles.filterBadge}>
              Hasta: {localFilters.fecha_fin}
            </span>
          )}
          {localFilters.tipo && (
            <span style={styles.filterBadge}>
              {localFilters.tipo === 'ingreso' ? '💰 Ingresos' : '💸 Egresos'}
            </span>
          )}
          {localFilters.id_cuenta && (
            <span style={styles.filterBadge}>
              Cuenta: {cuentas.find(c => c.id_cuenta === parseInt(localFilters.id_cuenta))?.nombre}
            </span>
          )}
          {localFilters.search && (
            <span style={styles.filterBadge}>
              Buscar: {localFilters.search}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MovimientoFilters;