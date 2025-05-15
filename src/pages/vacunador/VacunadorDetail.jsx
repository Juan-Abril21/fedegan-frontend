import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { vacunadorService } from "../../services/api";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "../../styles/Vacunador.css";

const VacunadorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacunador, setVacunador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVacunador();
  }, [id]);

  const fetchVacunador = async () => {
    try {
      const data = await vacunadorService.getById(id);
      setVacunador(data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los datos del vacunador");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro que desea eliminar este vacunador?")) {
      try {
        await vacunadorService.delete(id);
        navigate("/vacunadores");
      } catch (error) {
        setError("Error al eliminar el vacunador");
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!vacunador) {
    return <div className="not-found">Vacunador no encontrado</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalles del Vacunador</h1>
        <div className="detail-actions">
          <Link to="/vacunadores" className="btn-back">
            <FaArrowLeft />
          </Link>
          <Link to={`/vacunadores/edit/${id}`} className="btn-edit">
            <FaEdit />
          </Link>
            <FaTrash onClick={handleDelete} className="btn-delete" />
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">ID:</span>
          <span className="field-value">{vacunador.vacunador_id}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Nombre:</span>
          <span className="field-value">{vacunador.nombre_completo}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Documento:</span>
          <span className="field-value">{vacunador.documento}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Teléfono:</span>
          <span className="field-value">{vacunador.telefono || "-"}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Email:</span>
          <span className="field-value">{vacunador.email || "-"}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Zona Asignada:</span>
          <span className="field-value">{vacunador.zona_asignada || "-"}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Fecha Registro:</span>
          <span className="field-value">
            {new Date(vacunador.fecha_registro).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VacunadorDetail;
