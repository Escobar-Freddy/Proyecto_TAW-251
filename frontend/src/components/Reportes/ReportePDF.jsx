import React, { useState, useEffect } from 'react';
import { movimientosService } from '../../services/api';
import jsPDF from 'jspdf';

// Importar autoTable correctamente
import autoTable from 'jspdf-autotable';

function ReportePDF() {
  const [periodo, setPeriodo] = useState({
    fecha_inicio: '2026-04-01',
    fecha_fin: '2026-06-30',
  });
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState({
    total_ingresos: 0,
    total_egresos: 0,
    saldo: 0,
    cantidad_movimientos: 0,
  });
  const [movimientos, setMovimientos] = useState([]);
  const [ingresosPorCuenta, setIngresosPorCuenta] = useState([]);
  const [egresosPorCuenta, setEgresosPorCuenta] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    setCargandoDatos(true);
    setError(null);
    try {
      const resumenRes = await movimientosService.getResumen(periodo.fecha_inicio, periodo.fecha_fin);
      const movimientosRes = await movimientosService.getAll({
        fecha_inicio: periodo.fecha_inicio,
        fecha_fin: periodo.fecha_fin,
      });
      const cuentasRes = await movimientosService.getResumenPorCuenta(periodo.fecha_inicio, periodo.fecha_fin);
      
      setResumen({
        total_ingresos: Number(resumenRes.data?.total_ingresos) || 0,
        total_egresos: Number(resumenRes.data?.total_egresos) || 0,
        saldo: Number(resumenRes.data?.saldo) || 0,
        cantidad_movimientos: Number(resumenRes.data?.cantidad_movimientos) || 0,
      });
      
      setMovimientos(Array.isArray(movimientosRes.data) ? movimientosRes.data : []);
      setIngresosPorCuenta(cuentasRes.data?.ingresos || []);
      setEgresosPorCuenta(cuentasRes.data?.egresos || []);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Verifique la conexión con el servidor.');
    } finally {
      setCargandoDatos(false);
    }
  };

  const generarPDF = () => {
    try {
      setLoading(true);
      
      // Crear documento PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // ==================== ENCABEZADO ====================
      doc.setFontSize(18);
      doc.setTextColor(24, 144, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('SISTEMA DE TESORERÍA', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Asambleas de Dios - Distrito 2 La Paz', 20, 30);
      doc.text('Departamento de Misioneritas', 20, 38);
      
      // Línea
      doc.setDrawColor(24, 144, 255);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // Título
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE FINANCIERO', 20, 58);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${periodo.fecha_inicio} al ${periodo.fecha_fin}`, 20, 68);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 76);
      
      // ==================== RESUMEN ====================
      let yPos = 95;
      
      // Ingresos
      doc.setFillColor(82, 196, 26);
      doc.rect(20, yPos, 55, 25, 'F');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL INGRESOS', 25, yPos + 10);
      doc.setFontSize(11);
      doc.text(`Bs ${resumen.total_ingresos.toFixed(2)}`, 25, yPos + 20);
      
      // Egresos
      doc.setFillColor(255, 77, 79);
      doc.rect(80, yPos, 55, 25, 'F');
      doc.setFontSize(9);
      doc.text('TOTAL EGRESOS', 85, yPos + 10);
      doc.setFontSize(11);
      doc.text(`Bs ${resumen.total_egresos.toFixed(2)}`, 85, yPos + 20);
      
      // Saldo
      const saldoColor = resumen.saldo >= 0 ? [82, 196, 26] : [255, 77, 79];
      doc.setFillColor(saldoColor[0], saldoColor[1], saldoColor[2]);
      doc.rect(140, yPos, 55, 25, 'F');
      doc.setFontSize(9);
      doc.text('SALDO', 145, yPos + 10);
      doc.setFontSize(11);
      doc.text(`Bs ${resumen.saldo.toFixed(2)}`, 145, yPos + 20);
      
      yPos = 135;
      
      // ==================== INGRESOS POR CUENTA ====================
      if (ingresosPorCuenta.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(24, 144, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('INGRESOS POR CUENTA', 20, yPos);
        
        const ingresosData = ingresosPorCuenta.map(item => [
          item.codigo || '-',
          item.nombre || '-',
          `Bs ${(Number(item.total) || 0).toFixed(2)}`,
        ]);
        
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Código', 'Cuenta', 'Monto (Bs)']],
          body: ingresosData,
          foot: [['', 'TOTAL', `Bs ${resumen.total_ingresos.toFixed(2)}`]],
          theme: 'grid',
          headStyles: { fillColor: [24, 144, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
          footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', halign: 'right' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 20, right: 20 },
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // ==================== EGRESOS POR CUENTA ====================
      if (egresosPorCuenta.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(255, 77, 79);
        doc.setFont('helvetica', 'bold');
        doc.text('EGRESOS POR CUENTA', 20, yPos);
        
        const egresosData = egresosPorCuenta.map(item => [
          item.codigo || '-',
          item.nombre || '-',
          `Bs ${(Number(item.total) || 0).toFixed(2)}`,
        ]);
        
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Código', 'Cuenta', 'Monto (Bs)']],
          body: egresosData,
          foot: [['', 'TOTAL', `Bs ${resumen.total_egresos.toFixed(2)}`]],
          theme: 'grid',
          headStyles: { fillColor: [255, 77, 79], textColor: [255, 255, 255], fontStyle: 'bold' },
          footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', halign: 'right' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 20, right: 20 },
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // ==================== MOVIMIENTOS ====================
      if (movimientos.length > 0 && yPos < 250) {
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(11);
        doc.setTextColor(51, 51, 51);
        doc.setFont('helvetica', 'bold');
        doc.text('ÚLTIMOS MOVIMIENTOS', 20, yPos);
        
        const movimientosData = movimientos.slice(0, 15).map(item => [
          new Date(item.fecha_movimiento).toLocaleDateString('es-ES'),
          item.cuenta?.codigo || '-',
          item.descripcion?.substring(0, 20) || '-',
          item.tipo === 'ingreso' ? `Bs ${(Number(item.monto) || 0).toFixed(2)}` : `-Bs ${(Number(item.monto) || 0).toFixed(2)}`,
        ]);
        
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Fecha', 'Cuenta', 'Descripción', 'Monto']],
          body: movimientosData,
          theme: 'striped',
          headStyles: { fillColor: [51, 51, 51], textColor: [255, 255, 255], fontStyle: 'bold' },
          margin: { left: 20, right: 20 },
          columnStyles: {
            0: { cellWidth: 30, halign: 'center' },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 70 },
            3: { cellWidth: 35, halign: 'right' },
          },
        });
      }
      
      // ==================== PIE DE PÁGINA ====================
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Sistema de Tesorería - Asambleas de Dios Distrito 2 | Pág ${i} de ${pageCount} | ${user.nombre || 'Usuario'}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      // Guardar PDF
      doc.save(`reporte_${periodo.fecha_inicio}_al_${periodo.fecha_fin}.pdf`);
      alert('PDF generado exitosamente');
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodoChange = (e) => {
    const { name, value } = e.target;
    setPeriodo(prev => ({ ...prev, [name]: value }));
  };

  const styles = {
    container: { padding: '20px' },
    card: { 
      backgroundColor: 'white', 
      borderRadius: '10px', 
      padding: '20px', 
      marginBottom: '20px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px',
    },
    filtersContainer: { 
      display: 'flex', 
      gap: '15px', 
      alignItems: 'flex-end', 
      flexWrap: 'wrap', 
      marginBottom: '20px' 
    },
    filterGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '5px' 
    },
    label: { 
      fontSize: '12px', 
      fontWeight: 'bold', 
      color: '#666' 
    },
    input: { 
      padding: '8px 12px', 
      border: '1px solid #ddd', 
      borderRadius: '5px', 
      fontSize: '14px' 
    },
    btnSecondary: {
      padding: '8px 20px',
      backgroundColor: '#ba4c57',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    statCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: '12px',
      color: '#666',
      marginTop: '5px',
    },
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
    btnGenerar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      width: '100%',
      padding: '15px',
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px',
    },
  };

  if (cargandoDatos) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Cargando datos para el reporte...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>📄 Generador de Reporte PDF</div>
        <div style={styles.subtitle}>
          Genere reportes financieros profesionales en formato PDF
        </div>
        
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
          <button style={styles.btnSecondary} onClick={cargarDatos}>
            Actualizar Datos
          </button>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            ⚠️ {error}
          </div>
        )}

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#52c41a' }}>
              Bs {resumen.total_ingresos.toFixed(2)}
            </div>
            <div style={styles.statLabel}>💰 Total Ingresos</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#ff4d4f' }}>
              Bs {resumen.total_egresos.toFixed(2)}
            </div>
            <div style={styles.statLabel}>💸 Total Egresos</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: resumen.saldo >= 0 ? '#52c41a' : '#ff4d4f' }}>
              Bs {resumen.saldo.toFixed(2)}
            </div>
            <div style={styles.statLabel}>📊 Saldo</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {resumen.cantidad_movimientos}
            </div>
            <div style={styles.statLabel}>📝 Movimientos</div>
          </div>
        </div>

        <button 
          style={styles.btnGenerar}
          onClick={generarPDF}
          disabled={loading}
        >
          {loading ? '⏳ Generando PDF...' : '📄 GENERAR REPORTE PDF'}
        </button>
      </div>
    </div>
  );
}

export default ReportePDF;