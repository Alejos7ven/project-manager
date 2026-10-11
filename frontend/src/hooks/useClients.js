import { useState, useEffect, useCallback } from 'react';
import { getClients } from '../api/clients';

export const useClients = (initialParams = {}) => {
  const [clients, setClients] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(initialParams.search || '');
  const [status, setStatus] = useState(initialParams.status || 'all');
  const [page, setPage] = useState(initialParams.page || 1);
  const [perPage, setPerPage] = useState(initialParams.perPage || 10);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage,
      };
      if (search.trim()) params.search = search.trim();
      if (status && status !== 'all') params.status = status;

      const response = await getClients(params);
      if (response.success) {
        setClients(response.data || []);
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve clients list.');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, status]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1); // reset to page 1 on new search
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1); // reset to page 1 on filter
  };

  return {
    clients,
    meta,
    loading,
    error,
    search,
    status,
    page,
    setSearch: handleSearchChange,
    setStatus: handleStatusChange,
    setPage,
    setPerPage,
    reload: fetchClients,
  };
};

export default useClients;
