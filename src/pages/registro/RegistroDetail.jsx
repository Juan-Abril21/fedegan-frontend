import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  registroVacunacionService,
  vacunadorService,
  animalService,
  campaniaVacunacionService,
} from "../../services/api";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "../../styles/Registro.css";

const RegistroDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [vacunadores, setVacunadores] = useState({});
  const [animales, setAnimales] = useState({});
  const [campanias, setCampanias] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Obtener el registro específico
      const data = await registroVacunacionService.getById(id);
      setRegistro(data);

      // Obtener datos relacionados exactamente como en RegistrosList
      const [vacunadoresData, animalesData, campaniasData] = await Promise.all([
        vacunadorService.getAll(),
        animalService.getAll(),
        campaniaVacunacionService.getAll(),
      ]);

      // Crear mapas de búsqueda igual que en RegistrosList
      const vacunadoresMap = {};
      vacunadoresData.forEach((vacunador) => {
        vacunadoresMap[vacunador.vacunador_id] = vacunador.nombre_completo;
      });
      setVacunadores(vacunadoresMap);

      const animalesMap = {};
      animalesData.forEach((animal) => {
        animalesMap[animal.animal_id] = animal.identificador_externo;
      });
      setAnimales(animalesMap);

      const campaniasMap = {};
      campaniasData.forEach((campania) => {
        campaniasMap[campania.campania_id] = campania.nombre;
      });
      setCampanias(campaniasMap);

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos del registro");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro que desea eliminar este registro?")) {
      try {
        await registroVacunacionService.delete(id);
        navigate("/registros");
      } catch (error) {
        setError("Error al eliminar el registro");
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!registro) {
    return <div className="not-found">Registro no encontrado</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalles del Registro de Vacunación</h1>
        <div className="detail-actions">
          <Link to="/registros" className="btn-back">
            <FaArrowLeft /> Volver
          </Link>
          <Link to={`/registros/edit/${id}`} className="btn-edit">
            <FaEdit /> Editar
          </Link>
          <button className="btn-delete" onClick={handleDelete}>
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">ID Registro:</span>
          <span className="field-value">{registro.registro_id}</span>
        </div>

        <div className="detail-field">
          <span className="field-label">Vacunador:</span>
          <span className="field-value">
            {vacunadores ? (
              <Link to={`/vacunadores/view/${registro.vacunador.vacunador_id}`}>
                {registro.vacunador.nombre_completo}
              </Link>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">ID Animal:</span>
          <span className="field-value">
            {animales ? (
              <Link to={`/animales/view/${registro.animal.animal_id}`}>
                {registro.animal.animal_id}
              </Link>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Campaña:</span>
          <span className="field-value">
            {campanias ? (
              <Link to={`/campanias/view/${registro.campania.campania_id}`}>
                {registro.campania.nombre}
              </Link>
            ) : (
              "-"
            )}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Fecha de Aplicación:</span>
          <span className="field-value">
            {formatDateTime(registro.fecha_aplicacion)}
          </span>
        </div>

        <div className="detail-field">
          <span className="field-label">Resultado:</span>
          <span className="field-value">{registro.resultado || "-"}</span>
        </div>

        <div className="detail-field">
          <span className="field-label">Observaciones:</span>
          <span className="field-value">{registro.observaciones || "-"}</span>
        </div>

        <div className="detail-field">
          <span className="field-label">Sincronizado:</span>
          <span
            className={`field-value status ${
              registro.sincronizado ? "active" : "inactive"
            }`}
          >
            {registro.sincronizado ? "Sí" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegistroDetail;
