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
  
  createDatabase: async (connectionString, databaseName) => {
    const response = await api.post('/create-database', {
      connection_string: connectionString,
      database_name: databaseName
    });
    return response.data;
  },

  createTable: async (connectionString, tableName, columns) => {
    const response = await api.post('/create-table', {
      connection_string: connectionString,
      table_name: tableName,
      columns: columns
    });
    return response.data;
  },

  updateTable: async (connectionString, tableName, operations) => {
    const response = await api.post('/update-table', {
      connection_string: connectionString,
      table_name: tableName,
      operations: operations
    });
    return response.data;
  },

  deleteTable: async (connectionString, tableName) => {
    const response = await api.delete('/delete-table', {
      data: {
        connection_string: connectionString,
        table_name: tableName
      }
    });
    return response.data;
  },

  getTableData: async (connectionString, tableName, limit = 100, offset = 0) => {
    const response = await api.get(`/table-data/${tableName}`, {
      params: {
        connection_string: connectionString,
        limit,
        offset
      }
    });
    return response.data;
  }
};

