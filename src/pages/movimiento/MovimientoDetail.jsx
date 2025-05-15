import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  transporteService,
  fincaService,
  animalService,
} from "../../services/api";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "../../styles/Movimiento.css";

const MovimientoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movimiento, setMovimiento] = useState(null);
  const [animales, setAnimales] = useState({});
  const [fincaOrigen, setFincaOrigen] = useState({});
  const [destinoFinca, setDestinoFinca] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch specific movement by ID
      const movimientoData = await transporteService.getById(id);
      console.log("Movement data from API:", movimientoData);
      

      setMovimiento(movimientoData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Error al cargar los datos del movimiento. Por favor, intente nuevamente."
      );
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "¿Está seguro que desea eliminar este registro de movimiento?"
      )
    ) {
      try {
        await transporteService.delete(id);
        navigate("/movimientos");
      } catch (error) {
        setError("Error al eliminar el registro de movimiento");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">Cargando información del movimiento...</div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!movimiento) {
    return (
      <div className="not-found">Registro de movimiento no encontrado</div>
    );
  }

  // Format the date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalle de Movimiento Animal</h1>
        <div className="detail-actions">
          <Link to="/movimientos" className="btn-back">
            <FaArrowLeft />
          </Link>
          <Link to={`/movimientos/edit/${id}`} className="btn-edit">
            <FaEdit />
          </Link>
            <FaTrash className="btn-delete" onClick={handleDelete}/>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">ID de Movimiento:</span>
          <span className="field-value">{movimiento.transporte_id}</span>
        </div>

        <div className="detail-field">
          <span className="field-label">Animal:</span>
          <span className="field-value">
            {animales ? (
              <Link to={`/animales/view/${movimiento.animal.animal_id}`}>
                {movimiento.animal.animal_id}
              </Link>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Origen:</span>
          <span className="field-value">
            {fincaOrigen ? (
              <Link to={`/fincas/view/${movimiento.fincaOrigen.finca_id}`}>
                {movimiento.fincaOrigen.nombre_finca}
              </Link>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Destino:</span>
          <span className="field-value">
            {fincaOrigen ? (
              <Link to={`/fincas/view/${movimiento.fincaDestino.finca_id}`}>
                {movimiento.fincaDestino.nombre_finca}
              </Link>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Fecha de Movimiento:</span>
          <span className="field-value">
            {formatDate(movimiento.fechaTransporte) || "No especificado"}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Motivo:</span>
          <span className="field-value">
            {movimiento.motivo || "No especificado"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovimientoDetail;
