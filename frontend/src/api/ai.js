import api from './client';

export const generateAiDescription = async (projectName, clientName = null) => {
  const response = await api.post('/ai/generate-description', {
    project_name: projectName,
    client_name: clientName,
  });
  return response.data;
};
