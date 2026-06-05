import React, { useState, useEffect } from 'react';
import { movimientosService } from '../../services/api';

function ReporteIngreso() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState({
    fecha_inicio: '2026-04-01',
    fecha_fin: '2026-06-30',
  });

  useEffect(() => {
    cargarIngresos();
  }, [periodo]);

  const cargarIngresos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await movimientosService.getAll({
        fecha_inicio: periodo.fecha_inicio,
        fecha_fin: periodo.fecha_fin,
        tipo: 'ingreso',
      });
      
      // Asegurar que response.data es un array
      const datos = Array.isArray(response.data) ? response.data : [];
      setIngresos(datos);
      
    } catch (error) {
      console.error('Error cargando ingresos:', error);
      setError('Error al cargar los datos. Verifique la conexión con el servidor.');
      setIngresos([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular total de forma segura
  const totalIngresos = Array.isArray(ingresos) && ingresos.length > 0
    ? ingresos.reduce((sum, item) => sum + (Number(item.monto) || 0), 0)
    : 0;

  const handlePeriodoChange = (e) => {
    const { name, value } = e.target;
    setPeriodo(prev => ({ ...prev, [name]: value }));
  };

  const styles = {
    container: { padding: '20px' },
    filtersContainer: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    filterGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: 'bold', color: '#666' },
    input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' },
    btnPrimary: { 
      padding: '8px 20px', 
      backgroundColor: '#ba4c57', 
      color: 'white', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    card: { 
      backgroundColor: 'white', 
      borderRadius: '10px', 
      padding: '20px', 
      marginBottom: '20px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
    },
    cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#52c41a' },
    table: { 
      width: '100%', 
      backgroundColor: 'white', 
      borderRadius: '10px', 
      overflow: 'auto', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
    },
    th: { padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    errorContainer: {
      backgroundColor: '#fff2f0',
      border: '1px solid #ffccc7',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px',
      color: '#ff4d4f',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '10px',
    },
    emptyContainer: {
      textAlign: 'center',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '10px',
      color: '#999',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Cargando reporte de ingresos...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Filtros */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>📅 Fecha Inicio</label>
          <input 
            type="date" 
            name="fecha_inicio"
            style={styles.input} 
            value={periodo.fecha_inicio} 
            onChange={handlePeriodoChange}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>📅 Fecha Fin</label>
          <input 
            type="date" 
            name="fecha_fin"
            style={styles.input} 
            value={periodo.fecha_fin} 
            onChange={handlePeriodoChange}
          />
        </div>
        <button style={styles.btnPrimary} onClick={cargarIngresos}>
          Actualizar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorContainer}>
          ⚠️ {error}
        </div>
      )}

      {/* Tarjeta de total */}
      <div style={styles.card}>
        <div>💰 Total Ingresos</div>
        <div style={styles.cardValue}>
          Bs {totalIngresos.toFixed(2)}
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Período: {periodo.fecha_inicio} al {periodo.fecha_fin}
        </div>
      </div>

      {/* Tabla de ingresos */}
      {ingresos.length === 0 ? (
        <div style={styles.emptyContainer}>
          📭 No hay ingresos registrados en el período seleccionado
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>N° Recibo</th>
                <th style={styles.th}>Cuenta</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Persona/Origen</th>
                <th style={styles.th}>Monto (Bs)</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((item) => (
                <tr key={item.id_movimiento}>
                  <td style={styles.td}>
                    {item.fecha_movimiento ? new Date(item.fecha_movimiento).toLocaleDateString('es-ES') : '-'}
                  </td>
                  <td style={styles.td}>{item.numero_recibo || '-'}</td>
                  <td style={styles.td}>
                    {item.cuenta?.codigo} - {item.cuenta?.nombre || 'Sin cuenta'}
                  </td>
                  <td style={styles.td}>{item.descripcion?.substring(0, 50) || '-'}</td>
                  <td style={styles.td}>{item.persona_origen || item.iglesia_origen || '-'}</td>
                  <td style={{ ...styles.td, fontWeight: 'bold', color: '#52c41a' }}>
                    Bs {(Number(item.monto) || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReporteIngreso;