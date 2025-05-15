import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animalService, fincaService } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/Animal.css';

const AnimalesList = () => {
  const [animales, setAnimales] = useState([]);
  const [fincas, setFincas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimales();
    fetchFincas();
  }, []);

  const fetchAnimales = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAll();
      setAnimales(data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFincas = async () => {
    try {
      const data = await fincaService.getAll();
      const fincasMap = {};
      data.forEach(finca => {
        fincasMap[finca.finca_id] = finca.nombre_finca;
      });
      setFincas(fincasMap);
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este animal?')) {
      try {
        await animalService.delete(id);
        setAnimales(animales.filter(animal => animal.animal_id !== id));
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando animales...</div>;
  }

  return (
    <div className="animales-container">
      <h1>Animales</h1>
      <Link to="/animales/new" className="btn-add">
        <FaPlus /> Nuevo Animal
      </Link>
      
      {animales.length === 0 ? (
        <p className="no-data">No hay animales registrados</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Finca</th>
                <th>Tipo</th>
                <th>Raza</th>
                <th>Sexo</th>
                <th>Edad (meses)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {animales.map(animal => (
                <tr key={animal.animal_id}>
                  <td>{animal.animal_id}</td>
                  <td>{fincas[animal.finca_id] || '-'}</td>
                  <td>{animal.tipo_animal}</td>
                  <td>{animal.raza || '-'}</td>
                  <td>{animal.sexo || '-'}</td>
                  <td>{animal.edad_meses || '-'}</td>
                  <td className="actions">
                    <Link to={`/animales/view/${animal.animal_id}`} className="btn-view" title="Ver detalles">
                      <FaEye />
                    </Link>
                    <Link to={`/animales/edit/${animal.animal_id}`} className="btn-edit" title="Editar">
                      <FaEdit />
                    </Link>
                      <FaTrash className="btn-delete" onClick={() => handleDelete(animal.animal_id)} title="Eliminar"/>
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

export default AnimalesList;