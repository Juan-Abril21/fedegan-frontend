import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { broteService } from '../../services/api';
import '../../styles/Brote.css';

const BroteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    municipio: '',
    fecha_reporte: '',
    tipo_enfermedad: '',
    numero_casos: '',
    estado_brote: 'Activo'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchBrote();
    }
  }, [id]);

  const fetchBrote = async () => {
    try {
      const data = await broteService.getById(id);
      
      // Format the date for the date input
      const formattedDate = data.fecha_reporte 
        ? new Date(data.fecha_reporte).toISOString().split('T')[0]
        : '';
      
      setFormData({
        municipio: data.municipio || '',
        fecha_reporte: formattedDate,
        tipo_enfermedad: data.tipo_enfermedad || '',
        numero_casos: data.numero_casos || '',
        estado_brote: data.estado_brote || 'Activo'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching outbreak data:', error);
      setError('Error al cargar los datos del brote sanitario');
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
      setSubmitting(true);
      setError(null);
      
      // Format data before sending
      const formattedData = {
        ...formData,
        numero_casos: formData.numero_casos ? parseInt(formData.numero_casos) : null
      };
      
      if (isEditing) {
        await broteService.update(id, formattedData);
      } else {
        await broteService.create(formattedData);
      }
      
      navigate('/brotes');
    } catch (error) {
      console.error('Error saving outbreak:', error);
      setError('Error al guardar el brote sanitario');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Brote Sanitario' : 'Nuevo Brote Sanitario'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="municipio">Municipio</label>
          <input
            type="text"
            id="municipio"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fecha_reporte">Fecha de Reporte *</label>
          <input
            type="date"
            id="fecha_reporte"
            name="fecha_reporte"
            value={formData.fecha_reporte}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tipo_enfermedad">Tipo de Enfermedad</label>
          <select
            id="tipo_enfermedad"
            name="tipo_enfermedad"
            value={formData.tipo_enfermedad}
            onChange={handleChange}
          >
            <option value="">Seleccione un tipo</option>
            <option value="Aftosa">Fiebre Aftosa</option>
            <option value="Brucelosis">Brucelosis</option>
            <option value="Tuberculosis">Tuberculosis Bovina</option>
            <option value="Rabia">Rabia Bovina</option>
            <option value="Leptospirosis">Leptospirosis</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="numero_casos">Número de Casos</label>
          <input
            type="number"
            id="numero_casos"
            name="numero_casos"
            min="0"
            value={formData.numero_casos}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="estado_brote">Estado del Brote</label>
          <select
            id="estado_brote"
            name="estado_brote"
            value={formData.estado_brote}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Controlado">Controlado</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={() => navigate('/brotes')} 
            className="btn-cancel"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BroteForm;