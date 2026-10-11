import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../api/projects';

export const useProjects = (initialParams = {}) => {
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(initialParams.search || '');
  const [status, setStatus] = useState(initialParams.status || 'all');
  const [clientId, setClientId] = useState(initialParams.clientId || '');
  const [page, setPage] = useState(initialParams.page || 1);
  const [perPage, setPerPage] = useState(initialParams.perPage || 10);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage,
      };
      if (search.trim()) params.search = search.trim();
      if (status && status !== 'all') params.status = status;
      if (clientId) params.client_id = clientId;

      const response = await getProjects(params);
      if (response.success) {
        setProjects(response.data || []);
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve projects list.');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, status, clientId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleClientChange = (val) => {
    setClientId(val);
    setPage(1);
  };

  return {
    projects,
    meta,
    loading,
    error,
    search,
    status,
    clientId,
    page,
    setSearch: handleSearchChange,
    setStatus: handleStatusChange,
    setClientId: handleClientChange,
    setPage,
    setPerPage,
    reload: fetchProjects,
  };
};

export default useProjects;
