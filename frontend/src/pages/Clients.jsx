import React, { useState } from 'react';
import useClients from '../hooks/useClients';
import { createClient, updateClient, deleteClient } from '../api/clients';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import {
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
  RefreshCw,
  FolderKanban,
  Users,
} from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'active',
};

const Clients = () => {
  const {
    clients,
    meta,
    loading,
    error,
    search,
    status,
    setSearch,
    setStatus,
    setPage,
    reload,
  } = useClients();

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Lead', value: 'lead' },
  ];

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData(initialFormData);
    setFieldErrors({});
    setModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status: client.status || 'active',
    });
    setFieldErrors({});
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        setAlertMessage({ type: 'success', text: 'Client updated successfully.' });
      } else {
        await createClient(formData);
        setAlertMessage({ type: 'success', text: 'Client created successfully.' });
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setAlertMessage({
          type: 'error',
          text: err.response?.data?.message || 'An error occurred while saving the client.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    setDeleting(true);

    try {
      await deleteClient(clientToDelete.id);
      setAlertMessage({ type: 'success', text: 'Client deleted successfully.' });
      setDeleteModalOpen(false);
      setClientToDelete(null);
      reload();
    } catch (err) {
      if (err.response?.status === 409) {
        setAlertMessage({
          type: 'error',
          text: err.response.data.message || 'Cannot delete client with existing projects.',
        });
      } else {
        setAlertMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to delete client.',
        });
      }
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight m-0">
            Client Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your digital agency clients, companies, and project allocations.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Add Client
        </Button>
      </div>

      {/* Global Alert Notification */}
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.text}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {/* Controls Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or company..."
          className="w-full sm:w-80"
        />

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {statusFilters.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                status === tab.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
          <div className="h-10 bg-slate-100 rounded mt-4"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-white rounded-xl border border-rose-200 p-6 text-center space-y-3">
          <Alert type="error" message={error} />
          <Button variant="secondary" icon={RefreshCw} onClick={reload}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && clients.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No clients found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || status !== 'all'
              ? 'No clients match your filter criteria. Try adjusting your search query.'
              : 'You have not added any clients yet. Click below to add your first client.'}
          </p>
          {!search && status === 'all' && (
            <Button variant="primary" icon={Plus} size="sm" onClick={openCreateModal} className="mt-4">
              Add First Client
            </Button>
          )}
        </div>
      )}

      {/* Clients Desktop Table & Mobile Cards */}
      {!loading && !error && clients.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Client / Company</th>
                  <th className="py-3.5 px-5">Contact Details</th>
                  <th className="py-3.5 px-5">Projects</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900">{client.name}</div>
                      {client.company && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          {client.company}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <FolderKanban className="w-3 h-3" />
                        {client.projects_count ?? 0}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <Badge status={client.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(client)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit client"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(client)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {clients.map((client) => (
              <div key={client.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        {client.company}
                      </p>
                    )}
                  </div>
                  <Badge status={client.status} />
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-indigo-700 font-semibold pt-1">
                    <FolderKanban className="w-3.5 h-3.5 shrink-0" />
                    <span>{client.projects_count ?? 0} associated projects</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => openEditModal(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => confirmDelete(client)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}

      {/* Create / Edit Client Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="e.g. Acme Corporation"
            error={fieldErrors.name}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            placeholder="contact@acmecorp.com"
            error={fieldErrors.email}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleFormChange}
              placeholder="Acme Global Inc"
              error={fieldErrors.company}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="+1 (555) 000-0000"
              error={fieldErrors.phone}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Client Status <span className="text-rose-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="active">Active</option>
              <option value="lead">Lead</option>
              <option value="inactive">Inactive</option>
            </select>
            {fieldErrors.status && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.status[0]}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
            >
              {editingClient ? 'Save Changes' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Client Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete client{' '}
            <span className="font-bold text-slate-900">{clientToDelete?.name}</span>?
          </p>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 leading-relaxed">
            <strong>Note:</strong> Clients with active or linked projects cannot be deleted to maintain relational integrity.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={deleting}
              onClick={handleDelete}
            >
              Delete Client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
