import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaniaVacunacionService } from '../../services/api';
import '../../styles/Campania.css';

const CampaniaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Activa'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchCampania();
    }
  }, [id]);

  const fetchCampania = async () => {
    try {
      const data = await campaniaVacunacionService.getById(id);
      setFormData({
        nombre: data.nombre,
        fecha_inicio: data.fecha_inicio ? data.fecha_inicio.split('T')[0] : '',
        fecha_fin: data.fecha_fin ? data.fecha_fin.split('T')[0] : '',
        estado: data.estado || 'Activa'
      });
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los datos de la campaña');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEditing) {
        await campaniaVacunacionService.update(id, formData);
      } else {
        await campaniaVacunacionService.create(formData);
      }
      
      navigate('/campanias');
    } catch (error) {
      setError('Error al guardar la campaña');
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Campaña' : 'Nueva Campaña'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Campaña *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha_inicio">Fecha de Inicio *</label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fecha_fin">Fecha de Fin</label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              min={formData.fecha_inicio}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activa">Activa</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/campanias')} className="btn-cancel">
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

export default CampaniaForm;