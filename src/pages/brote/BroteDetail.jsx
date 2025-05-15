import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { broteService } from '../../services/api';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import '../../styles/Brote.css';

const BroteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brote, setBrote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrote();
  }, [id]);

  const fetchBrote = async () => {
    try {
      const data = await broteService.getById(id);
      setBrote(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching outbreak details:', error);
      setError('Error al cargar los detalles del brote sanitario');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro que desea eliminar este brote sanitario?')) {
      try {
        await broteService.delete(id);
        navigate('/brotes');
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
    return <div className="loading">Cargando detalles del brote sanitario...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!brote) {
    return <div className="not-found">Brote sanitario no encontrado</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalle de Brote Sanitario</h1>
        <div className="detail-actions">
          <Link to="/brotes" className="btn-back">
            <FaArrowLeft />
          </Link>
          <Link to={`/brotes/edit/${id}`} className="btn-edit">
            <FaEdit />
          </Link>
            <FaTrash className="btn-delete" onClick={handleDelete}/>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">ID del Brote:</span>
          <span className="field-value">{brote.brote_id}</span>
        </div>
        
        <div className="detail-field">
          <span className="field-label">Municipio:</span>
          <span className="field-value">{brote.municipio || 'No especificado'}</span>
        </div>
        
        <div className="detail-field">
          <span className="field-label">Fecha de Reporte:</span>
          <span className="field-value">{formatDate(brote.fecha_reporte)}</span>
        </div>
        
        <div className="detail-field">
          <span className="field-label">Tipo de Enfermedad:</span>
          <span className="field-value">{brote.tipo_enfermedad || 'No especificado'}</span>
        </div>
        
        <div className="detail-field">
          <span className="field-label">Número de Casos:</span>
          <span className="field-value">{brote.numero_casos || 0}</span>
        </div>
        
        <div className="detail-field">
          <span className="field-label">Estado del Brote:</span>
          <span className={`field-value status-badge ${brote.estado_brote === 'Activo' ? 'status-active' : 'status-inactive'}`}>
            {brote.estado_brote}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BroteDetail;