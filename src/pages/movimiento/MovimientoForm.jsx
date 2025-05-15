import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  transporteService,
  animalService,
  fincaService,
} from "../../services/api";
import "../../styles/Movimiento.css";

const MovimientoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    animal_id: "",
    origen_finca_id: "",
    destino_finca_id: "",
    fecha_movimiento: "",
    motivo: "",
  });

  const [animals, setAnimals] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch animals and farms for the dropdowns
        const [animalsData, fincasData] = await Promise.all([
          animalService.getAll(),
          fincaService.getAll(),
        ]);

        setAnimals(animalsData);
        setFincas(fincasData);
        if (isEditing) {
          const movementData = await transporteService.getById(id);
          console.log("Movement data from API:", movementData); // Para depuración

          // Format the date for the datetime-local input
          const formattedDate = movementData.fechaTransporte
            ? new Date(movementData.fechaTransporte).toISOString().slice(0, 16)
            : "";

          setFormData({
            animal_id: movementData.animal?.animal_id || "",
            origen_finca_id: movementData.fincaOrigen?.finca_id || "",
            destino_finca_id: movementData.fincaDestino?.finca_id || "",
            fecha_movimiento: formattedDate,
            motivo: movementData.motivo || "",
            tipo_documento: movementData.tipo_documento || "",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading form data:", error);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Solo modificar la función handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Transformar los datos al formato que espera la API
      const formattedData = {
        animal: {
          animal_id: parseInt(formData.animal_id),
        },
        fincaOrigen: {
          finca_id: parseInt(formData.origen_finca_id),
        },
        fincaDestino: {
          finca_id: parseInt(formData.destino_finca_id),
        },
        // Extraer solo la fecha de fecha_movimiento (sin la hora)
        fechaTransporte: formData.fecha_movimiento
          ? formData.fecha_movimiento.split("T")[0]
          : "",
        motivo: formData.motivo,
      };

      if (isEditing) {
        await transporteService.update(id, formattedData);
      } else {
        await transporteService.create(formattedData);
      }

      navigate("/movimientos");
    } catch (error) {
      console.error("Error saving movement:", error);
      setError(
        "Error al guardar el movimiento. Por favor, intente nuevamente."
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? "Editar Movimiento" : "Nuevo Movimiento"}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="animal_id">Animal *</label>
          <select
            id="animal_id"
            name="animal_id"
            value={formData.animal_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un animal</option>
            {animals.map((animal) => (
              <option key={animal.animal_id} value={animal.animal_id}>
                {animal.tipo_animal}{" "}
                {animal.identificador_externo
                  ? `- ${animal.identificador_externo}`
                  : `(ID: ${animal.animal_id})`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="origen_finca_id">Finca de Origen</label>
            <select
              id="origen_finca_id"
              name="origen_finca_id"
              value={formData.origen_finca_id}
              onChange={handleChange}
            >
              <option value="">Seleccione una finca</option>
              {fincas.map((finca) => (
                <option key={finca.finca_id} value={finca.finca_id}>
                  {finca.nombre_finca}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="destino_finca_id">Finca de Destino</label>
            <select
              id="destino_finca_id"
              name="destino_finca_id"
              value={formData.destino_finca_id}
              onChange={handleChange}
            >
              <option value="">Seleccione una finca</option>
              {fincas.map((finca) => (
                <option key={finca.finca_id} value={finca.finca_id}>
                  {finca.nombre_finca}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fecha_movimiento">Fecha y Hora de Movimiento *</label>
          <input
            type="datetime-local"
            id="fecha_movimiento"
            name="fecha_movimiento"
            value={formData.fecha_movimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="motivo">Motivo del Movimiento</label>
          <input
            type="text"
            id="motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={() => navigate("/movimientos")}
            className="btn-cancel"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovimientoForm;
