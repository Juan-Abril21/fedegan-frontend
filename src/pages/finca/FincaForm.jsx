import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fincaService } from '../../services/api';
import '../../styles/Finca.css';

const FincaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre_finca: '',
    propietario: '',
    municipio: '',
    departamento: '',
    latitud: '',
    longitud: '',
    estado: 'Activa'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchFinca();
    }
  }, [id]);

  const fetchFinca = async () => {
    try {
      const data = await fincaService.getById(id);
      setFormData({
        nombre_finca: data.nombre_finca,
        propietario: data.propietario,
        municipio: data.municipio || '',
        departamento: data.departamento || '',
        latitud: data.latitud || '',
        longitud: data.longitud || '',
        estado: data.estado || 'Activa'
      });
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los datos de la finca');
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
      
      // Convert latitude and longitude to numbers
      const formattedData = {
        ...formData,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null
      };

      if (isEditing) {
        await fincaService.update(id, formattedData);
      } else {
        await fincaService.create(formattedData);
      }
      
      navigate('/fincas');
    } catch (error) {
      setError('Error al guardar la finca');
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Editar Finca' : 'Nueva Finca'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_finca">Nombre de la Finca *</label>
          <input
            type="text"
            id="nombre_finca"
            name="nombre_finca"
            value={formData.nombre_finca}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="propietario">Propietario *</label>
          <input
            type="text"
            id="propietario"
            name="propietario"
            value={formData.propietario}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
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
            <label htmlFor="departamento">Departamento</label>
            <input
              type="text"
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitud">Latitud</label>
            <input
              type="number"
              step="any"
              id="latitud"
              name="latitud"
              value={formData.latitud}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="longitud">Longitud</label>
            <input
              type="number"
              step="any"
              id="longitud"
              name="longitud"
              value={formData.longitud}
              onChange={handleChange}
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
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>
        
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/fincas')} className="btn-cancel">
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

export default FincaForm;