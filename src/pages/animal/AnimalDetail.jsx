import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { animalService, fincaService } from '../../services/api';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import '../../styles/Animal.css';

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [finca, setFinca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  const fetchAnimal = async () => {
    try {
      const data = await animalService.getById(id);
      console.log("Datos del animal recibidos:", data); // Log para depuración
      setAnimal(data);
      
      // Verificar las diferentes formas en que puede venir la finca
      if (data.finca && typeof data.finca === 'object' && data.finca.finca_id) {
        console.log("Finca encontrada como objeto anidado:", data.finca);
        setFinca(data.finca);
      } else if (data.finca_id) {
        console.log("Finca encontrada como ID:", data.finca_id);
        try {
          const fincaData = await fincaService.getById(data.finca_id);
          console.log("Datos de finca obtenidos por ID:", fincaData);
          setFinca(fincaData);
        } catch (fincaError) {
          console.error("Error al cargar la finca por ID:", fincaError);
          // Intentar cargar todas las fincas y buscar por ID como respaldo
          try {
            const todasFincas = await fincaService.getAll();
            const fincaEncontrada = todasFincas.find(f => f.finca_id === data.finca_id);
            if (fincaEncontrada) {
              console.log("Finca encontrada en la lista completa:", fincaEncontrada);
              setFinca(fincaEncontrada);
            }
          } catch (error) {
            console.error("Error al intentar cargar todas las fincas:", error);
          }
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error completo al cargar el animal:", error);
      setError('Error al cargar los datos del animal');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro que desea eliminar este animal?')) {
      try {
        await animalService.delete(id);
        navigate('/animales');
      } catch (error) {
        setError('Error al eliminar el animal');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!animal) {
    return <div className="not-found">Animal no encontrado</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detalles del Animal</h1>
        <div className="detail-actions">
          <Link to="/animales" className="btn-back">
            <FaArrowLeft />
          </Link>
          <Link to={`/animales/edit/${id}`} className="btn-edit">
            <FaEdit />
          </Link>
            <FaTrash className="btn-delete" onClick={handleDelete}/>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-field">
          <span className="field-label">ID:</span>
          <span className="field-value">{animal.animal_id}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Finca:</span>
          <span className="field-value">
            {finca ? (
              <Link to={`/fincas/view/${finca.finca_id}`}>
                {finca.nombre_finca}
              </Link>
            ) : (
              animal.finca_id ? `ID: ${animal.finca_id}` : '-'
            )}
          </span>
        </div>
        <div className="detail-field">
          <span className="field-label">Tipo:</span>
          <span className="field-value">{animal.tipo_animal}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Raza:</span>
          <span className="field-value">{animal.raza || '-'}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Sexo:</span>
          <span className="field-value">{animal.sexo || '-'}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Edad:</span>
          <span className="field-value">
            {animal.edad_meses ? `${animal.edad_meses} meses` : '-'}
          </span>
        </div>
        {animal.identificador_externo && (
          <div className="detail-field">
            <span className="field-label">Identificador:</span>
            <span className="field-value">{animal.identificador_externo}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalDetail;