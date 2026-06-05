import React, { useState, useEffect } from 'react';
import { movimientosService } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ReporteResumen() {
  const [resumen, setResumen] = useState({
    total_ingresos: 0,
    total_egresos: 0,
    saldo: 0,
    cantidad_movimientos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState({
    fecha_inicio: '2026-04-01',
    fecha_fin: '2026-06-30',
  });

  useEffect(() => {
    cargarResumen();
  }, [periodo]);

  const cargarResumen = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await movimientosService.getResumen(periodo.fecha_inicio, periodo.fecha_fin);
      setResumen({
        total_ingresos: response.data?.total_ingresos || 0,
        total_egresos: response.data?.total_egresos || 0,
        saldo: response.data?.saldo || 0,
        cantidad_movimientos: response.data?.cantidad_movimientos || 0,
      });
    } catch (error) {
      console.error('Error cargando resumen:', error);
      setError('Error al cargar el resumen');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { nombre: 'Ingresos', monto: resumen.total_ingresos },
    { nombre: 'Egresos', monto: resumen.total_egresos },
  ];

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
    btnPrimary: { padding: '8px 20px', backgroundColor: '#ba4c57', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    cardsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    cardValue: { fontSize: '24px', fontWeight: 'bold' },
    chartContainer: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    errorContainer: { backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '10px', padding: '15px', marginBottom: '20px', color: '#ff4d4f' },
    loadingContainer: { textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px' },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>Cargando resumen...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>📅 Fecha Inicio</label>
          <input type="date" name="fecha_inicio" style={styles.input} value={periodo.fecha_inicio} onChange={handlePeriodoChange} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>📅 Fecha Fin</label>
          <input type="date" name="fecha_fin" style={styles.input} value={periodo.fecha_fin} onChange={handlePeriodoChange} />
        </div>
        <button style={styles.btnPrimary} onClick={cargarResumen}>Actualizar</button>
      </div>

      {error && <div style={styles.errorContainer}>⚠️ {error}</div>}

      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <div>💰 Ingresos</div>
          <div style={{ ...styles.cardValue, color: '#52c41a' }}>Bs {resumen.total_ingresos.toFixed(2)}</div>
        </div>
        <div style={styles.card}>
          <div>💸 Egresos</div>
          <div style={{ ...styles.cardValue, color: '#ff4d4f' }}>Bs {resumen.total_egresos.toFixed(2)}</div>
        </div>
        <div style={styles.card}>
          <div>📊 Saldo</div>
          <div style={{ ...styles.cardValue, color: resumen.saldo >= 0 ? '#52c41a' : '#ff4d4f' }}>Bs {resumen.saldo.toFixed(2)}</div>
        </div>
        <div style={styles.card}>
          <div>📝 Movimientos</div>
          <div style={styles.cardValue}>{resumen.cantidad_movimientos}</div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <h3>Comparativa Ingresos vs Egresos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis tickFormatter={(value) => `Bs ${value / 1000}k`} />
            <Tooltip formatter={(value) => `Bs ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="monto" fill="#52c41a" name="Monto" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ReporteResumen;