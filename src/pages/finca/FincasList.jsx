import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fincaService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/Finca.css';

const FincasList = () => {
  const [fincas, setFincas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFincas();
  }, []);

  const fetchFincas = async () => {
    try {
      setLoading(true);
      const data = await fincaService.getAll();
      setFincas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farms:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta finca?')) {
      try {
        await fincaService.delete(id);
        setFincas(fincas.filter(finca => finca.finca_id !== id));
      } catch (error) {
        console.error('Error deleting farm:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando fincas...</div>;
  }

  return (
    <div className="fincas-container">
      <h1>Fincas</h1>
      <Link to="/fincas/new" className="btn-add">
        <FaPlus /> Nueva Finca
      </Link>
      
      {fincas.length === 0 ? (
        <p className="no-data">No hay fincas registradas</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Propietario</th>
                <th>Municipio</th>
                <th>Departamento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fincas.map(finca => (
                <tr key={finca.finca_id}>
                  <td>{finca.finca_id}</td>
                  <td>{finca.nombre_finca}</td>
                  <td>{finca.propietario}</td>
                  <td>{finca.municipio}</td>
                  <td>{finca.departamento}</td>
                  <td>{finca.estado}</td>
                  <td className="actions">
                    <Link to={`/fincas/view/${finca.finca_id}`} className="btn-view" title="Ver detalles">
                      <FaEye />
                    </Link>
                    <Link to={`/fincas/edit/${finca.finca_id}`} className="btn-edit" title="Editar">
                      <FaEdit />
                    </Link>
                      <FaTrash className="btn-delete" onClick={() => handleDelete(finca.finca_id)} title="Eliminar"/>
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

export default FincasList;