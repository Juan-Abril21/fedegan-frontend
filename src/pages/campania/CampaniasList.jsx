import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaniaVacunacionService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/Campania.css';

const CampaniasList = () => {
  const [campanias, setCampanias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampanias();
  }, []);

  const fetchCampanias = async () => {
    try {
      setLoading(true);
      const data = await campaniaVacunacionService.getAll();
      setCampanias(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta campaña?')) {
      try {
        await campaniaVacunacionService.delete(id);
        setCampanias(campanias.filter(campania => campania.campania_id !== id));
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Cargando campañas...</div>;
  }

  return (
    <div className="campanias-container">
      <h1>Campañas de Vacunación</h1>
      <Link to="/campanias/new" className="btn-add">
        <FaPlus /> Nueva Campaña
      </Link>
      
      {campanias.length === 0 ? (
        <p className="no-data">No hay campañas registradas</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campanias.map(campania => (
                <tr key={campania.campania_id}>
                  <td>{campania.campania_id}</td>
                  <td>{campania.nombre}</td>
                  <td>{formatDate(campania.fecha_inicio)}</td>
                  <td>{formatDate(campania.fecha_fin)}</td>
                  <td>
                    <span className={`status ${campania.estado === 'Activa' ? 'active' : 'inactive'}`}>
                      {campania.estado}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/campanias/view/${campania.campania_id}`} className="btn-view" title="Ver detalles">
                      <FaEye />
                    </Link>
                    <Link to={`/campanias/edit/${campania.campania_id}`} className="btn-edit" title="Editar">
                      <FaEdit />
                    </Link>
                    
                      <FaTrash className="btn-delete" onClick={() => handleDelete(campania.campania_id)} title="Eliminar"/>
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

export default CampaniasList;