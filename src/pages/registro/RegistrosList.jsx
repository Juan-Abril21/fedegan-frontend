import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registroVacunacionService, vacunadorService, animalService, campaniaVacunacionService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import "../../styles/Registro.css";

const RegistrosList = () => {
  const [registros, setRegistros] = useState([]);
  const [vacunadores, setVacunadores] = useState({});
  const [animales, setAnimales] = useState({});
  const [campanias, setCampanias] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all registrations
      const registrosData = await registroVacunacionService.getAll();
      setRegistros(registrosData);
      
      // Fetch related data for display purposes
      const [vacunadoresData, animalesData, campaniasData] = await Promise.all([
        vacunadorService.getAll(),
        animalService.getAll(),
        campaniaVacunacionService.getAll()
      ]);
      
      // Create lookup objects
      const vacunadoresMap = {};
      vacunadoresData.forEach(vacunador => {
        vacunadoresMap[vacunador.vacunador_id] = vacunador.nombre_completo;
      });
      setVacunadores(vacunadoresMap);
      
      const animalesMap = {};
      animalesData.forEach(animal => {
        animalesMap[animal.animal_id] = animal.identificador_externo;
      });
      setAnimales(animalesMap);
      
      const campaniasMap = {};
      campaniasData.forEach(campania => {
        campaniasMap[campania.campania_id] = campania.nombre;
      });
      setCampanias(campaniasMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este registro de vacunación?')) {
      try {
        await registroVacunacionService.delete(id);
        setRegistros(registros.filter(registro => registro.registro_id !== id));
      } catch (error) {
        console.error('Error deleting registration:', error);
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Cargando registros de vacunación...</div>;
  }

  return (
    <div className="registros-container">
      <h1>Registros de Vacunación</h1>
      <Link to="/registros/new" className="btn-add">
        <FaPlus /> Nuevo Registro
      </Link>
      
      {registros.length === 0 ? (
        <p className="no-data">No hay registros de vacunación</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vacunador</th>
                <th>ID Animal</th>
                <th>Campaña</th>
                <th>Fecha Aplicación</th>
                <th>Resultado</th>
                <th>Sincronizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(registro => (
                <tr key={registro.registro_id}>
                  <td>{registro.registro_id}</td>
                  <td>{vacunadores[registro.vacunador_id] || 'No disponible'}</td>
                  <td>{[registro.animal_id] || 'No disponible'}</td>
                  <td>{campanias[registro.campania_id] || 'No disponible'}</td>
                  <td>{formatDateTime(registro.fecha_aplicacion)}</td>
                  <td>{registro.resultado || '-'}</td>
                  <td>
                    <span className={`status ${registro.sincronizado ? 'active' : 'inactive'}`}>
                      {registro.sincronizado ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/registros/view/${registro.registro_id}`} className="btn-view" title="Ver detalles">
                      <FaEye />
                    </Link>
                    <Link to={`/registros/edit/${registro.registro_id}`} className="btn-edit" title="Editar">
                      <FaEdit />
                    </Link>
                      <FaTrash className="btn-delete" onClick={() => handleDelete(registro.registro_id)} title="Eliminar"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrosList;