import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { broteService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/Brote.css';

const BrotesList = () => {
  const [brotes, setBrotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrotes();
  }, []);

  const fetchBrotes = async () => {
    try {
      setLoading(true);
      const data = await broteService.getAll();
      setBrotes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching outbreaks:', error);
      setError('Error al cargar los brotes sanitarios');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este registro de brote sanitario?')) {
      try {
        await broteService.delete(id);
        setBrotes(brotes.filter(brote => brote.brote_id !== id));
      } catch (error) {
        console.error('Error deleting outbreak:', error);
        setError('Error al eliminar el brote sanitario');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return <div className="loading">Cargando brotes sanitarios...</div>;
  }

  return (
    <div className="brotes-container">
      <h1>Brotes Sanitarios</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <Link to="/brotes/new" className="btn-add">
        <FaPlus /> Nuevo Brote Sanitario
      </Link>
      
      {brotes.length === 0 ? (
        <p className="no-data">No hay registros de brotes sanitarios</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Municipio</th>
                <th>Fecha de Reporte</th>
                <th>Tipo de Enfermedad</th>
                <th>Número de Casos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {brotes.map(brote => (
                <tr key={brote.brote_id}>
                  <td>{brote.brote_id}</td>
                  <td>{brote.municipio || '-'}</td>
                  <td>{formatDate(brote.fecha_reporte)}</td>
                  <td>{brote.tipo_enfermedad || '-'}</td>
                  <td>{brote.numero_casos || 0}</td>
                  <td>
                    <span className={`status-badge ${brote.estado_brote === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                      {brote.estado_brote}
                    </span>
                  </td>
                  <td className="actions">
                    <Link 
                      to={`/brotes/view/${brote.brote_id}`} 
                      className="btn-view" 
                      title="Ver detalles"
                    >
                      <FaEye />
                    </Link>
                    <Link 
                      to={`/brotes/edit/${brote.brote_id}`} 
                      className="btn-edit" 
                      title="Editar"
                    >
                      <FaEdit />
                    </Link>
                      <FaTrash className="btn-delete" 
                      onClick={() => handleDelete(brote.brote_id)} 
                      title="Eliminar"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrotesList;