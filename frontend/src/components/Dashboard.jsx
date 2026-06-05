import React, { useState, useEffect } from 'react';
import { movimientosService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datosMensuales, setDatosMensuales] = useState([]);
  const [topCuentas, setTopCuentas] = useState([]);
  const [tendencia, setTendencia] = useState(null);
  const [periodo, setPeriodo] = useState({
    fecha_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fecha_fin: new Date().toISOString().split('T')[0],
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ✅ DEFINIR LOS COLORES DENTRO DEL COMPONENTE
  const COLORS_INGRESOS = ['#52c41a', '#1890ff', '#faad14', '#722ed1', '#eb2f96', '#13c2c2', '#fa8c16', '#a0d911'];
  const COLORS_EGRESOS = ['#ff4d4f', '#ff7875', '#ffa39e', '#ff7c43', '#ff9f40', '#f39c12', '#e67e22', '#d35400'];

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resumenRes, cuentasRes, movimientosRes] = await Promise.all([
        movimientosService.getResumen(periodo.fecha_inicio, periodo.fecha_fin),
        movimientosService.getResumenPorCuenta(periodo.fecha_inicio, periodo.fecha_fin),
        movimientosService.getAll({ fecha_inicio: periodo.fecha_inicio, fecha_fin: periodo.fecha_fin }),
      ]);
      
      setResumen(resumenRes.data);
      
      const movimientos = movimientosRes.data;
      const mesesData = {};
      
      movimientos.forEach(m => {
        const mes = new Date(m.fecha_movimiento).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        if (!mesesData[mes]) {
          mesesData[mes] = { mes, ingresos: 0, egresos: 0 };
        }
        if (m.tipo === 'ingreso') {
          mesesData[mes].ingresos += m.monto;
        } else {
          mesesData[mes].egresos += m.monto;
        }
      });
      
      setDatosMensuales(Object.values(mesesData));
      
      const ingresosTop = (cuentasRes.data?.ingresos || [])
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      const egresosTop = (cuentasRes.data?.egresos || [])
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      
      setTopCuentas({ ingresos: ingresosTop, egresos: egresosTop });
      
      const fechaInicioAnterior = new Date(periodo.fecha_inicio);
      const fechaFinAnterior = new Date(periodo.fecha_fin);
      const diffDays = Math.ceil((fechaFinAnterior - fechaInicioAnterior) / (1000 * 60 * 60 * 24));
      fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diffDays);
      fechaFinAnterior.setDate(fechaFinAnterior.getDate() - diffDays);
      
      const periodoAnterior = await movimientosService.getResumen(
        fechaInicioAnterior.toISOString().split('T')[0],
        fechaFinAnterior.toISOString().split('T')[0]
      );
      
      const ingresoActual = resumenRes.data?.total_ingresos || 0;
      const ingresoAnterior = periodoAnterior.data?.total_ingresos || 0;
      const egresoActual = resumenRes.data?.total_egresos || 0;
      const egresoAnterior = periodoAnterior.data?.total_egresos || 0;
      
      setTendencia({
        ingresos: {
          actual: ingresoActual,
          anterior: ingresoAnterior,
          porcentaje: ingresoAnterior > 0 ? ((ingresoActual - ingresoAnterior) / ingresoAnterior * 100) : 0,
        },
        egresos: {
          actual: egresoActual,
          anterior: egresoAnterior,
          porcentaje: egresoAnterior > 0 ? ((egresoActual - egresoAnterior) / egresoAnterior * 100) : 0,
        },
      });
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-BO', { 
      style: 'currency', 
      currency: 'BOB',
      minimumFractionDigits: 2 
    }).format(valor);
  };

  const getTendenciaColor = (porcentaje) => {
    if (porcentaje > 0) return '#52c41a';
    if (porcentaje < 0) return '#ff4d4f';
    return '#faad14';
  };

  const getTendenciaIcono = (porcentaje) => {
    if (porcentaje > 0) return '📈';
    if (porcentaje < 0) return '📉';
    return '➡️';
  };

  const styles = {
    container: {
      marginLeft: '250px',
      padding: '20px',
      backgroundColor: '#ececec',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#25020f',
    },
    subtitle: {
      fontSize: '14px',
      color: '#25020f',
    },
    periodoContainer: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px',
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    label: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#666',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
    },
    btnPrimary: {
      padding: '8px 20px',
      backgroundColor: '#ff1168',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardTitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
    },
    cardTrend: {
      fontSize: '12px',
      marginTop: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    chartTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chartSubtitle: {
      fontSize: '12px',
      color: '#999',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '20px',
    },
    welcomeCard: {
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      background: '#9e1e4c',
      color: 'white',
    },
    welcomeText: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    welcomeSubtext: {
      fontSize: '14px',
      opacity: 0.9,
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: 'white',
      borderRadius: '12px',
      marginLeft: '250px',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div>Cargando datos del dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Panel de Control</h2>
        <p style={styles.subtitle}>Visualice las estadísticas y métricas principales del sistema</p>
      </div>

      {/* Selector de período */}
      <div style={styles.periodoContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>📅 Fecha Inicio</label>
          <input type="date" style={styles.input} value={periodo.fecha_inicio} onChange={(e) => setPeriodo({...periodo, fecha_inicio: e.target.value})} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>📅 Fecha Fin</label>
          <input type="date" style={styles.input} value={periodo.fecha_fin} onChange={(e) => setPeriodo({...periodo, fecha_fin: e.target.value})} />
        </div>
        <button style={styles.btnPrimary} onClick={cargarDatos}>Actualizar</button>
      </div>

      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeText}>¡Bienvenido, {user.nombre || 'Usuario'}! 👋</div>
        <div style={styles.welcomeSubtext}>
          Resumen financiero del período {periodo.fecha_inicio} al {periodo.fecha_fin}
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>💰 Total Ingresos</div>
          <div style={{ ...styles.cardValue, color: '#52c41a' }}>{formatearMoneda(resumen?.total_ingresos || 0)}</div>
          {tendencia && (
            <div style={styles.cardTrend}>
              <span style={{ color: getTendenciaColor(tendencia.ingresos.porcentaje) }}>
                {getTendenciaIcono(tendencia.ingresos.porcentaje)} {Math.abs(tendencia.ingresos.porcentaje).toFixed(1)}%
              </span>
              <span style={{ color: '#666' }}> vs período anterior</span>
            </div>
          )}
        </div>
        
        <div style={styles.card}>
          <div style={styles.cardTitle}>💸 Total Egresos</div>
          <div style={{ ...styles.cardValue, color: '#ff4d4f' }}>{formatearMoneda(resumen?.total_egresos || 0)}</div>
          {tendencia && (
            <div style={styles.cardTrend}>
              <span style={{ color: getTendenciaColor(-tendencia.egresos.porcentaje) }}>
                {getTendenciaIcono(-tendencia.egresos.porcentaje)} {Math.abs(tendencia.egresos.porcentaje).toFixed(1)}%
              </span>
              <span style={{ color: '#666' }}> vs período anterior</span>
            </div>
          )}
        </div>
        
        <div style={styles.card}>
          <div style={styles.cardTitle}>📊 Saldo</div>
          <div style={{ ...styles.cardValue, color: (resumen?.saldo || 0) >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {formatearMoneda(resumen?.saldo || 0)}
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.cardTitle}>📝 Movimientos</div>
          <div style={styles.cardValue}>{resumen?.cantidad_movimientos || 0}</div>
        </div>
      </div>

      {/* Gráfico de evolución mensual (comentado por ahora) */}
      {/* {datosMensuales.length > 0 && ( ... )} */}

      {/* Grid de gráficos */}
      <div style={styles.gridContainer}>
        {/* Gráfico de barras - Ingresos por cuenta */}
        {topCuentas.ingresos?.length > 0 && (
          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>
              <span>💰 Top 5 Ingresos por Cuenta</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCuentas.ingresos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `Bs ${value / 1000}k`} />
                <YAxis type="category" dataKey="nombre" width={100} />
                <Tooltip formatter={(value) => formatearMoneda(value)} />
                <Bar dataKey="total" fill="#52c41a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico circular - Distribución de Ingresos */}
        {topCuentas.ingresos?.length > 0 && (
          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>
              <span>🥧 Distribución de Ingresos</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCuentas.ingresos}
                  dataKey="total"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ nombre, percent }) => {
                    
                    const nombreCorto = nombre.length > 20 ? nombre.substring(0, 17) + '...' : nombre;
                    return `${nombreCorto}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  
                >
                  {topCuentas.ingresos.map((entry, index) => (
                    <Cell key={`cell-ingreso-${index}`} fill={COLORS_INGRESOS[index % COLORS_INGRESOS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatearMoneda(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico de barras - Egresos por cuenta */}
        {topCuentas.egresos?.length > 0 && (
          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>
              <span>💸 Top 5 Egresos por Cuenta</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCuentas.egresos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `Bs ${value / 1000}k`} />
                <YAxis type="category" dataKey="nombre" width={100} />
                <Tooltip formatter={(value) => formatearMoneda(value)} />
                <Bar dataKey="total" fill="#ff4d4f" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico circular - Distribución de Egresos */}
        {topCuentas.egresos?.length > 0 && (
          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>
              <span>🥧 Distribución de Egresos</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCuentas.egresos}
                  dataKey="total"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ nombre, percent }) => {
                    const nombreCorto = nombre.length > 20 ? nombre.substring(0, 17) + '...' : nombre;
                    return `${nombreCorto}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {topCuentas.egresos.map((entry, index) => (
                    <Cell key={`cell-egreso-${index}`} fill={COLORS_EGRESOS[index % COLORS_EGRESOS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatearMoneda(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Resumen de tendencias */}
      {tendencia && (
        <div style={styles.chartContainer}>
          <div style={styles.chartTitle}>
            <span>📈 Análisis de Tendencias</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>💰 Ingresos</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {formatearMoneda(tendencia.ingresos.actual)}
              </div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>
                vs {formatearMoneda(tendencia.ingresos.anterior)}
              </div>
              <div style={{ color: getTendenciaColor(tendencia.ingresos.porcentaje), fontSize: '14px', marginTop: '5px' }}>
                {getTendenciaIcono(tendencia.ingresos.porcentaje)} {Math.abs(tendencia.ingresos.porcentaje).toFixed(1)}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666' }}>💸 Egresos</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {formatearMoneda(tendencia.egresos.actual)}
              </div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>
                vs {formatearMoneda(tendencia.egresos.anterior)}
              </div>
              <div style={{ color: getTendenciaColor(-tendencia.egresos.porcentaje), fontSize: '14px', marginTop: '5px' }}>
                {getTendenciaIcono(-tendencia.egresos.porcentaje)} {Math.abs(tendencia.egresos.porcentaje).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;