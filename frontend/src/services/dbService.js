import api from './api';

export const dbService = {
  testConnection: async (connectionString) => {
    const response = await api.post('/test-connection', { connection_string: connectionString });
    return response.data;
  },
  
  getSchema: async (connectionString) => {
    const response = await api.post('/schema', { connection_string: connectionString });
    return response.data;
  },
  
  // Future methods: createTable, updateColumn, etc.
};
