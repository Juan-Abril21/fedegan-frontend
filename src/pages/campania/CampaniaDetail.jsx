import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaniaVacunacionService } from '../../services/api';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import '../../styles/Campania.css';

const CampaniaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campania, setCampania] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampania();
  }, [id]);

  const fetchCampania = async () => {
    try {
      const data = await campaniaVacunacionService.getById(id);
      setCampania(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los datos de la campaña');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro que desea eliminar esta campaña?')) {
      try {
        await campaniaVacunacionService.delete(id);
        navigate('/campanias');
      } catch (error) {
        setError('Error al eliminar la campaña');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!campania) {
    return <div className="not-found">Campaña no encontrada</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalles de la Campaña</h1>
        <div className="detail-actions">
          <Link to="/campanias" className="btn-back">
            <FaArrowLeft />
          </Link>
          <Link to={`/campanias/edit/${id}`} className="btn-edit">
            <FaEdit />
          </Link>
            <FaTrash className="btn-delete" onClick={handleDelete}/>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">ID:</span>
          <span className="field-value">{campania.campania_id}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Nombre:</span>
          <span className="field-value">{campania.nombre}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Fecha Inicio:</span>
          <span className="field-value">{formatDate(campania.fecha_inicio)}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Fecha Fin:</span>
          <span className="field-value">{formatDate(campania.fecha_fin)}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Estado:</span>
          <span className={`field-value status ${
            campania.estado === 'Activa' ? 'active' : 
            campania.estado === 'Finalizada' ? 'inactive' : 'inactive'
          }`}>
            {campania.estado}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaniaDetail;