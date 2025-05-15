import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vacunadorService } from "../../services/api";
import "../../styles/Vacunador.css";

const VacunadorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre_completo: "",
    documento: "",
    telefono: "",
    email: "",
    zona_asignada: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchVacunador();
    }
  }, [id]);

  const fetchVacunador = async () => {
    try {
      const data = await vacunadorService.getById(id);
      setFormData({
        nombre_completo: data.nombre_completo,
        documento: data.documento,
        telefono: data.telefono || "",
        email: data.email || "",
        zona_asignada: data.zona_asignada || "",
      });
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los datos del vacunador");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSubmitting(true);
    setError(null);

    // Transformar los datos al formato que espera la API
    const formattedData = {
      nombre_completo: formData.nombre_completo,
      documento: Number(formData.documento), // Convertir a número
      telefono: Number(formData.telefono),   // Convertir a número
      email: formData.email,
      zona_asignada: formData.zona_asignada,
    };

    if (isEditing) {
      await vacunadorService.update(id, formattedData);
    } else {
      await vacunadorService.create(formattedData);
    }

    navigate("/vacunadores");
  } catch (error) {
    console.error("Error saving vacunador:", error);
    setError(
      "Error al guardar el vacunador. Por favor, intente nuevamente."
    );
    setSubmitting(false);
  }
};

  if (loading && isEditing) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? "Editar Vacunador" : "Nuevo Vacunador"}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_completo">Nombre Completo *</label>
          <input
            type="text"
            id="nombre_completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="documento">Documento de Identidad *</label>
          <input
            type="number"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="number"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="zona_asignada">Zona Asignada</label>
          <input
            type="text"
            id="zona_asignada"
            name="zona_asignada"
            value={formData.zona_asignada}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={() => navigate("/vacunadores")}
            className="btn-cancel"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VacunadorForm;
