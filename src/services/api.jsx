import axios from 'axios';

const API_URL = 'https://fedeganapi-hqb0c8bbdjf5dzbw.westeurope-01.azurewebsites.net/api';

// Servicio para Vacunadores
export const vacunadorService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/vacunadores`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farms:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/vacunadores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farm:', error);
      throw error;
    }
  },
  create: async (finca) => {
    try {
      const response = await axios.post(`${API_URL}/vacunadores`, finca);
      return response.data;
    } catch (error) {
      console.error('Error creating farm:', error);
      throw error;
    }
  },
  update: async (id, finca) => {
    try {
      const response = await axios.put(`${API_URL}/vacunadores/${id}`, finca);
      return response.data;
    } catch (error) {
      console.error('Error updating farm:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/vacunadores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting farm:', error);
      throw error;
    }
  }
};

// Finca Service
export const fincaService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/fincas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farms:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/fincas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farm:', error);
      throw error;
    }
  },
  create: async (finca) => {
    try {
      const response = await axios.post(`${API_URL}/fincas`, finca);
      return response.data;
    } catch (error) {
      console.error('Error creating farm:', error);
      throw error;
    }
  },
  update: async (id, finca) => {
    try {
      const response = await axios.put(`${API_URL}/fincas/${id}`, finca);
      return response.data;
    } catch (error) {
      console.error('Error updating farm:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/fincas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting farm:', error);
      throw error;
    }
  }
};

// Animal Service
export const animalService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/animales`);
      return response.data;
    } catch (error) {
      console.error('Error fetching animals:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/animales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching animal:', error);
      throw error;
    }
  },
  create: async (animal) => {
    try {
      const response = await axios.post(`${API_URL}/animales`, animal);
      return response.data;
    } catch (error) {
      console.error('Error creating animal:', error);
      throw error;
    }
  },
  update: async (id, animal) => {
    try {
      const response = await axios.put(`${API_URL}/animales/${id}`, animal);
      return response.data;
    } catch (error) {
      console.error('Error updating animal:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/animales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting animal:', error);
      throw error;
    }
  }
};

// Campaña Vacunación Service
export const campaniaVacunacionService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/campaniavacunacion`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaccination campaigns:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/campaniavacunacion/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaccination campaign:', error);
      throw error;
    }
  },
  create: async (campania) => {
    try {
      const response = await axios.post(`${API_URL}/campaniavacunacion`, campania);
      return response.data;
    } catch (error) {
      console.error('Error creating vaccination campaign:', error);
      throw error;
    }
  },
  update: async (id, campania) => {
    try {
      const response = await axios.put(`${API_URL}/campaniavacunacion/${id}`, campania);
      return response.data;
    } catch (error) {
      console.error('Error updating vaccination campaign:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/campaniavacunacion/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vaccination campaign:', error);
      throw error;
    }
  }
};

// Registro Vacunación Service
export const registroVacunacionService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/registrovacunacion`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/registrovacunacion/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaccination record:', error);
      throw error;
    }
  },
  create: async (registro) => {
    try {
      const response = await axios.post(`${API_URL}/registrovacunacion`, registro);
      return response.data;
    } catch (error) {
      console.error('Error creating vaccination record:', error);
      throw error;
    }
  },
  update: async (id, registro) => {
    try {
      const response = await axios.put(`${API_URL}/registrovacunacion/${id}`, registro);
      return response.data;
    } catch (error) {
      console.error('Error updating vaccination record:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/registrovacunacion/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vaccination record:', error);
      throw error;
    }
  }
};

// Movimiento Animal Service
export const transporteService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/transportes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching animal movements:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/transportes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching animal movement:', error);
      throw error;
    }
  },
  create: async (movimiento) => {
    try {
      const response = await axios.post(`${API_URL}/transportes`, movimiento);
      return response.data;
    } catch (error) {
      console.error('Error creating animal movement:', error);
      throw error;
    }
  },
  update: async (id, movimiento) => {
    try {
      const response = await axios.put(`${API_URL}/transportes/${id}`, movimiento);
      return response.data;
    } catch (error) {
      console.error('Error updating animal movement:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/transportes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting animal movement:', error);
      throw error;
    }
  }
};

// Brote Sanitario Service
export const broteService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/brote`);
      return response.data;
    } catch (error) {
      console.error('Error fetching outbreaks:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/brote/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching outbreak:', error);
      throw error;
    }
  },
  create: async (brote) => {
    try {
      const response = await axios.post(`${API_URL}/brote`, brote);
      return response.data;
    } catch (error) {
      console.error('Error creating outbreak:', error);
      throw error;
    }
  },
  update: async (id, brote) => {
    try {
      const response = await axios.put(`${API_URL}/brote/${id}`, brote);
      return response.data;
    } catch (error) {
      console.error('Error updating outbreak:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/brote/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting outbreak:', error);
      throw error;
    }
  }
};