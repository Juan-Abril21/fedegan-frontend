import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { animalService, fincaService } from "../../services/api";
import "../../styles/Animal.css";

const AnimalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    finca_id: "",
    tipo_animal: "",
    raza: "",
    sexo: "",
    edad_meses: "",
    identificador_externo: "",
  });

  const [fincas, setFincas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFincas();
    if (isEditing) {
      fetchAnimal(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchFincas = async () => {
    try {
      const data = await fincaService.getAll();
      setFincas(data);
    } catch (error) {
      setError("Error al cargar las fincas");
    }
  };

  const fetchAnimal = async (animalId) => {
  try {
    const data = await animalService.getById(animalId);
    console.log("Animal data:", data); // Para depuración
    
    setFormData({
      finca_id: data.finca?.finca_id || "", // Accede al ID de la finca a través del objeto anidado
      tipo_animal: data.tipo_animal,
      raza: data.raza || "",
      sexo: data.sexo || "",
      edad_meses: data.edad_meses || "",
      identificador_externo: data.identificador_externo || "",
    });
    setLoading(false);
  } catch (error) {
    console.error("Error fetching animal:", error);
    setError("Error al cargar los datos del animal");
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
        finca: {
          finca_id: parseInt(formData.finca_id),
        },
        tipo_animal: formData.tipo_animal,
        raza: formData.raza,
        sexo: formData.sexo,
        edad_meses: formData.edad_meses ? parseInt(formData.edad_meses) : null,
      };

      if (isEditing) {
        await animalService.update(id, formattedData);
      } else {
        await animalService.create(formattedData);
      }

      navigate("/animales");
    } catch (error) {
      console.error("Error saving movement:", error);
      setError(
        "Error al guardar el movimiento. Por favor, intente nuevamente."
      );
      setSubmitting(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? "Editar Animal" : "Nuevo Animal"}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="finca_id">Finca *</label>
          <select
            id="finca_id"
            name="finca_id"
            value={formData.finca_id}
            onChange={handleChange}
            required
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
          <label htmlFor="tipo_animal">Tipo de Animal *</label>
          <select
            id="tipo_animal"
            name="tipo_animal"
            value={formData.tipo_animal}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="Bovino">Bovino</option>
            <option value="Porcino">Porcino</option>
            <option value="Ovino">Ovino</option>
            <option value="Caprino">Caprino</option>
            <option value="Equino">Equino</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="raza">Raza</label>
            <input
              type="text"
              id="raza"
              name="raza"
              value={formData.raza}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edad_meses">Edad (meses)</label>
            <input
              type="number"
              id="edad_meses"
              name="edad_meses"
              value={formData.edad_meses}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={() => navigate("/animales")}
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

export default AnimalForm;
