import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registroVacunacionService, vacunadorService, animalService, campaniaVacunacionService } from '../../services/api';
import "../../styles/Registro.css";

const RegistroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    vacunador_id: '',
    animal_id: '',
    campania_id: '',
    fecha_aplicacion: new Date().toISOString().split('.')[0].slice(0, -3),
    resultado: '',
    observaciones: '',
    geolocalizacion: '',
    sincronizado: false
  });
  
  const [vacunadores, setVacunadores] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [campanias, setCampanias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRelatedData();
    if (isEditing) {
      fetchRegistro();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchRelatedData = async () => {
    try {
      const [vacunadoresData, animalesData, campaniasData] = await Promise.all([
        vacunadorService.getAll(),
        animalService.getAll(),
        campaniaVacunacionService.getAll()
      ]);
      
      setVacunadores(vacunadoresData);
      setAnimales(animalesData);
      setCampanias(campaniasData);
    } catch (error) {
      setError('Error al cargar datos relacionados');
    }
  };

  const fetchRegistro = async () => {
  try {
    const data = await registroVacunacionService.getById(id);
    console.log('Registro data:', data); // Para depuración
    
    setFormData({
      vacunador_id: data.vacunador?.vacunador_id || '',
      animal_id: data.animal?.animal_id || '',
      campania_id: data.campania?.campania_id || '',
      fecha_aplicacion: data.fecha_aplicacion ? data.fecha_aplicacion.slice(0, 16) : '',
      resultado: data.resultado || '',
      observaciones: data.observaciones || '',
      geolocalizacion: data.geolocalizacion || '',
      sincronizado: data.sincronizado === true || data.sincronizado === "true" || false
    });
    setLoading(false);
  } catch (error) {
    console.error('Error fetching registro:', error);
    setError('Error al cargar los datos del registro');
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    // Formatear los datos según la estructura requerida por la API
    const formattedData = {
      vacunador: {
        vacunador_id: parseInt(formData.vacunador_id)
      },
      animal: {
        animal_id: parseInt(formData.animal_id)
      },
      campania: {
        campania_id: parseInt(formData.campania_id)
      },
      fecha_aplicacion: formData.fecha_aplicacion.split('T')[0], // Convertir a formato YYYY-MM-DD
      resultado: formData.resultado || '',
      observaciones: formData.observaciones || '',
      geolocalizacion: formData.geolocalizacion || '',
      sincronizado: formData.sincronizado ? "true" : "false" // Enviar como string "true"/"false"
    };

    if (isEditing) {
      await registroVacunacionService.update(id, formattedData);
    } else {
      await registroVacunacionService.create(formattedData);
    }
    
    navigate('/registros');
  } catch (error) {
    console.error('Error al guardar el registro:', error);
    setError('Error al guardar el registro');
    setLoading(false);
  }
};

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            geolocalizacion: `${latitude},${longitude}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('No se pudo obtener la ubicación actual.');
        }
      );
    } else {
      alert('La geolocalización no está soportada por este navegador.');
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Registro de Vacunación' : 'Nuevo Registro de Vacunación'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vacunador_id">Vacunador *</label>
          <select
            id="vacunador_id"
            name="vacunador_id"
            value={formData.vacunador_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un vacunador</option>
            {vacunadores.map(vacunador => (
              <option key={vacunador.vacunador_id} value={vacunador.vacunador_id}>
                {vacunador.nombre_completo}
              </option>
            ))}
          </select>
        </div>
        
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
            {animales.map(animal => (
              <option key={animal.animal_id} value={animal.animal_id}>
                {animal.identificador_externo} - {animal.tipo_animal} 
                {animal.raza ? ` (${animal.raza})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="campania_id">Campaña *</label>
          <select
            id="campania_id"
            name="campania_id"
            value={formData.campania_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una campaña</option>
            {campanias.map(campania => (
              <option key={campania.campania_id} value={campania.campania_id}>
                {campania.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha_aplicacion">Fecha y Hora de Aplicación *</label>
            <input
              type="datetime-local"
              id="fecha_aplicacion"
              name="fecha_aplicacion"
              value={formData.fecha_aplicacion}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="resultado">Resultado</label>
            <select
              id="resultado"
              name="resultado"
              value={formData.resultado}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="Exitoso">Exitoso</option>
              <option value="Fallido">Fallido</option>
              <option value="Parcial">Parcial</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="sincronizado"
                checked={formData.sincronizado}
                onChange={handleChange}
              />
              Sincronizado
            </label>
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/registros')} className="btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroForm;