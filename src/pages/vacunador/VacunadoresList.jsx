import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vacunadorService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/Vacunador.css';

const VacunadoresList = () => {
  const [vacunadores, setVacunadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVacunadores();
  }, []);

  const fetchVacunadores = async () => {
    try {
      setLoading(true);
      const data = await vacunadorService.getAll();
      setVacunadores(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vaccinators:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (window.confirm('¿Está seguro que desea eliminar este vacunador?')) {
    try {
      await vacunadorService.delete(id);
      setVacunadores(vacunadores.filter(vacunador => vacunador.vacunador_id !== id));
    } catch (error) {
      console.error('Error deleting vaccinator:', error);
      
      // Mostrar mensaje más específico al usuario
      if (error.response && error.response.status === 500) {
        alert('No se puede eliminar este vacunador porque tiene registros de vacunación asociados. Elimine primero los registros.');
      } else {
        alert('Error al eliminar el vacunador. Por favor, inténtelo de nuevo más tarde.');
      }
    }
  }
};

  if (loading) {
    return <div className="loading">Cargando vacunadores...</div>;
  }

  return (
    <div className="vacunadores-container">
      <h1>Vacunadores</h1>
      <Link to="/vacunadores/new" className="btn-add">
        <FaPlus /> Nuevo Vacunador
      </Link>
      
      {vacunadores.length === 0 ? (
        <p className="no-data">No hay vacunadores registrados</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Zona Asignada</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacunadores.map(vacunador => (
                <tr key={vacunador.vacunador_id}>
                  <td>{vacunador.vacunador_id}</td>
                  <td>{vacunador.nombre_completo}</td>
                  <td>{vacunador.documento}</td>
                  <td>{vacunador.telefono || '-'}</td>
                  <td>{vacunador.email || '-'}</td>
                  <td>{vacunador.zona_asignada || '-'}</td>
                  <td>{new Date(vacunador.fecha_registro).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/vacunadores/view/${vacunador.vacunador_id}`} className="btn-view" title="Ver detalles">
                      <FaEye />
                    </Link>
                    <Link to={`/vacunadores/edit/${vacunador.vacunador_id}`} className="btn-edit" title="Editar">
                      <FaEdit />
                    </Link>
                  
                      <FaTrash className="btn-delete" onClick={() => handleDelete(vacunador.vacunador_id)} title="Eliminar"/>
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

export default VacunadoresList;