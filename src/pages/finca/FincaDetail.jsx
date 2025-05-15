import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fincaService } from '../../services/api';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import '../../styles/Finca.css';

const FincaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [finca, setFinca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinca();
  }, [id]);

  const fetchFinca = async () => {
    try {
      const data = await fincaService.getById(id);
      setFinca(data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los datos de la finca');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro que desea eliminar esta finca?')) {
      try {
        await fincaService.delete(id);
        navigate('/fincas');
      } catch (error) {
        setError('Error al eliminar la finca');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!finca) {
    return <div className="not-found">Finca no encontrada</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalles de la Finca</h1>
        <div className="detail-actions">
          <Link to="/fincas" className="btn-back">
            <FaArrowLeft /> Volver
          </Link>
          <Link to={`/fincas/edit/${id}`} className="btn-edit">
            <FaEdit /> Editar
          </Link>
          <button className="btn-delete" onClick={handleDelete}>
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">Nombre:</span>
          <span className="field-value">{finca.nombre_finca}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Propietario:</span>
          <span className="field-value">{finca.propietario}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Municipio:</span>
          <span className="field-value">{finca.municipio || '-'}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Departamento:</span>
          <span className="field-value">{finca.departamento || '-'}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Ubicación:</span>
          <span className="field-value">
            {finca.latitud && finca.longitud 
              ? `Lat: ${finca.latitud}, Long: ${finca.longitud}`
              : 'No especificada'}
          </span>
        </div>
        <div className="detail-field">
          <span className="field-label">Estado:</span>
          <span className={`field-value status ${finca.estado === 'Activa' ? 'active' : 'inactive'}`}>
            {finca.estado}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FincaDetail;