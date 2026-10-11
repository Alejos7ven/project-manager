import api from './client';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
