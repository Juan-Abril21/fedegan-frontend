import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transporteService, fincaService, animalService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/Movimiento.css';

const MovimientosList = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [animals, setAnimals] = useState({});
  const [fincas, setFincas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all movements
      const movimientosData = await transporteService.getAll();
      
      // Fetch all animals and create a lookup map
      const animalsData = await animalService.getAll();
      const animalsMap = {};
      animalsData.forEach(animal => {
        animalsMap[animal.animal_id] = animal;
      });
      
      // Fetch all farms and create a lookup map
      const fincasData = await fincaService.getAll();
      const fincasMap = {};
      fincasData.forEach(finca => {
        fincasMap[finca.finca_id] = finca;
      });
      
      setMovimientos(movimientosData);
      setAnimals(animalsMap);
      setFincas(fincasMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este registro de movimiento?')) {
      try {
        await transporteService.delete(id);
        setMovimientos(movimientos.filter(movimiento => movimiento.transporte_id !== id));
      } catch (error) {
        console.error('Error deleting movement:', error);
        setError('Error al eliminar el movimiento. Por favor, intente nuevamente.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return <div className="loading">Cargando movimientos...</div>;
  }

  return (
    <div className="movimientos-container">
      <h1>Movimientos de Animales</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <Link to="/movimientos/new" className="btn-add">
        <FaPlus /> Nuevo Movimiento
      </Link>
      
      {movimientos.length === 0 ? (
        <p className="no-data">No hay registros de movimientos</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Animal</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map(movimiento => (
                <tr key={movimiento.transporte_id}>
                  <td>{movimiento.transporte_id}</td>
                  <td>
                    {animals[movimiento.animal_id] ? (
                      <>
                        {animals[movimiento.animal_id].tipo_animal}
                        {animals[movimiento.animal_id].identificador_externo && 
                          ` (${animals[movimiento.animal_id].identificador_externo})`}
                      </>
                    ) : 'No disponible'}
                  </td>
                  <td>
                    {movimiento.origen_finca_id && fincas[movimiento.origen_finca_id] 
                      ? fincas[movimiento.origen_finca_id].nombre_finca 
                      : '-'}
                  </td>
                  <td>
                    {movimiento.destino_finca_id && fincas[movimiento.destino_finca_id] 
                      ? fincas[movimiento.destino_finca_id].nombre_finca 
                      : '-'}
                  </td>
                  <td>{formatDate(movimiento.fecha_transporte)}</td>
                  <td>{movimiento.motivo || '-'}</td>
                  <td className="actions">
                    <Link 
                      to={`/movimientos/view/${movimiento.transporte_id}`} 
                      className="btn-view" 
                      title="Ver detalles"
                    >
                      <FaEye />
                    </Link>
                    <Link 
                      to={`/movimientos/edit/${movimiento.transporte_id}`} 
                      className="btn-edit" 
                      title="Editar"
                    >
                      <FaEdit />
                    </Link>
                      <FaTrash className="btn-delete" 
                      onClick={() => handleDelete(movimiento.transporte_id)} 
                      title="Eliminar"/>
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

export default MovimientosList;