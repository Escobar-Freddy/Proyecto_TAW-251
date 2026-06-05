import React, { useState } from 'react';
import ReporteIngreso from './ReporteIngreso';
import ReporteEgreso from './ReporteEgreso';
import ReporteResumen from './ReporteResumen';
import ReportePDF from './ReportePDF';

function Reportes() {
  const [activeTab, setActiveTab] = useState('ingresos');

  const styles = {
    container: { marginLeft: '250px', padding: '20px' },
    tabsContainer: {
      display: 'flex',
      gap: '5px',
      marginBottom: '20px',
      borderBottom: '1px solid #ddd',
      backgroundColor: 'white',
      padding: '0 20px',
      borderRadius: '10px 10px 0 0',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '12px 20px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      transition: 'all 0.3s',
    },
    tabActive: {
      borderBottom: '3px solid #1890ff',
      color: '#1890ff',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabsContainer}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'ingresos' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('ingresos')}
        >
          💰 Reporte de Ingresos
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'egresos' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('egresos')}
        >
          💸 Reporte de Egresos
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'resumen' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('resumen')}
        >
          📊 Resumen General
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'pdf' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('pdf')}
        >
          📄 Generador PDF
        </button>
      </div>

      {activeTab === 'ingresos' && <ReporteIngreso />}
      {activeTab === 'egresos' && <ReporteEgreso />}
      {activeTab === 'resumen' && <ReporteResumen />}
      {activeTab === 'pdf' && <ReportePDF />}
    </div>
  );
}

export default Reportes;