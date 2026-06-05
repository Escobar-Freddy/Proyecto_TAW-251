import React, { useState, useEffect } from 'react';
import { cuentasService } from '../../services/api';

function CuentaTree({ onSelectCuenta, selectedCuentaId }) {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarArbol();
  }, []);

  const cargarArbol = async () => {
    try {
      const response = await cuentasService.getTree();
      setTreeData(response.data);
      // Expandir nodos principales por defecto
      const initialExpanded = {};
      response.data.forEach(node => {
        if (node.children && node.children.length > 0) {
          initialExpanded[node.id_cuenta] = true;
        }
      });
      setExpandedNodes(initialExpanded);
    } catch (error) {
      console.error('Error cargando árbol de cuentas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const getTipoIcon = (tipo) => {
    return tipo === 'ingreso' ? '💰' : '💸';
  };

  const getTipoColor = (tipo) => {
    return tipo === 'ingreso' ? '#52c41a' : '#ff4d4f';
  };

  const filterTree = (nodes, term) => {
    if (!term) return nodes;
    
    return nodes.reduce((acc, node) => {
      const matchesNode = node.nombre.toLowerCase().includes(term.toLowerCase()) ||
                          node.codigo.toLowerCase().includes(term.toLowerCase());
      
      const filteredChildren = node.children ? filterTree(node.children, term) : [];
      
      if (matchesNode || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren
        });
      }
      return acc;
    }, []);
  };

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expandedNodes[node.id_cuenta];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedCuentaId === node.id_cuenta;
    const paddingLeft = level * 20;

    const styles = {
      nodeContainer: { marginBottom: '2px' },
      nodeContent: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        paddingLeft: paddingLeft + 12,
        backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        border: isSelected ? '1px solid #1890ff' : '1px solid transparent',
      },
      nodeContentHover: { backgroundColor: 'red' },
      expandIcon: {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#666',
        marginRight: '4px',
      },
      tipoIcon: { fontSize: '16px', marginRight: '10px' },
      codigo: { 
        fontWeight: 'bold', 
        color: '#666', 
        marginRight: '12px',
        fontSize: '13px',
        minWidth: '50px'
      },
      nombre: { 
        flex: 1, 
        fontSize: '14px',
        fontWeight: level === 0 ? 'bold' : 'normal'
      },
      nivel: { 
        fontSize: '11px', 
        color: '#999', 
        marginLeft: '10px',
        backgroundColor: '#f0f0f0',
        padding: '2px 6px',
        borderRadius: '10px'
      },
      tipoBadge: {
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '10px',
        backgroundColor: getTipoColor(node.tipo),
        color: 'white',
        marginLeft: '10px'
      },
      childrenContainer: { marginLeft: '0px' },
    };

    return (
      <div key={node.id_cuenta} style={styles.nodeContainer}>
        <div
          style={styles.nodeContent}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {hasChildren && (
            <div 
              style={styles.expandIcon}
              onClick={() => toggleNode(node.id_cuenta)}
            >
              {isExpanded ? '📂' : '📁'}
            </div>
          )}
          {!hasChildren && <div style={{ width: '28px' }} />}
          
          <div style={styles.tipoIcon}>{getTipoIcon(node.tipo)}</div>
          <span style={styles.codigo}>{node.codigo}</span>
          <span 
            style={styles.nombre}
            onClick={() => onSelectCuenta && onSelectCuenta(node)}
          >
            {node.nombre}
          </span>
          <span style={styles.nivel}>Nivel {node.nivel}</span>
          <span style={styles.tipoBadge}>
            {node.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div style={styles.childrenContainer}>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredData = filterTree(treeData, searchTerm);

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      overflow: 'auto',
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    searchContainer: {
      marginBottom: '20px',
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    treeContainer: {
      maxHeight: 'calc(100vh - 300px)',
      overflowY: 'auto',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
    statsContainer: {
      marginTop: '20px',
      paddingTop: '15px',
      borderTop: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#666',
    },
    expandAllBtn: {
      padding: '5px 10px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>Cargando árbol de cuentas...</div>
      </div>
    );
  }

  const contarCuentas = (nodes) => {
    let count = nodes.length;
    nodes.forEach(node => {
      if (node.children) count += contarCuentas(node.children);
    });
    return count;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          📋 Plan de Cuentas
          <button 
            style={styles.expandAllBtn}
            onClick={() => {
              const allExpanded = {};
              const expandAll = (nodes) => {
                nodes.forEach(node => {
                  if (node.children && node.children.length > 0) {
                    allExpanded[node.id_cuenta] = true;
                    expandAll(node.children);
                  }
                });
              };
              expandAll(treeData);
              setExpandedNodes(allExpanded);
            }}
          >
            Expandir todo
          </button>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="🔍 Buscar cuenta por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.treeContainer}>
        {filteredData.length > 0 ? (
          filteredData.map(node => renderTreeNode(node, 0))
        ) : (
          <div style={styles.loadingContainer}>
            {searchTerm ? 'No se encontraron cuentas que coincidan con la búsqueda' : 'No hay cuentas registradas'}
          </div>
        )}
      </div>

      <div style={styles.statsContainer}>
        <span>📊 Total cuentas: {contarCuentas(treeData)}</span>
        <span>💰 Ingresos | 💸 Egresos</span>
      </div>
    </div>
  );
}

export default CuentaTree;