import React, { useState, useEffect } from 'react';
import useProjects from '../hooks/useProjects';
import { createProject, updateProject, deleteProject } from '../api/projects';
import { getClients } from '../api/clients';
import { generateAiDescription } from '../api/ai';
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
  Calendar,
  Building,
  RefreshCw,
  Sparkles,
  FolderKanban,
  Clock,
  Loader2,
} from 'lucide-react';

const initialFormData = {
  client_id: '',
  name: '',
  description: '',
  status: 'pending',
  start_date: '',
  deadline: '',
};

const Projects = () => {
  const {
    projects,
    meta,
    loading,
    error,
    search,
    status,
    setSearch,
    setStatus,
    setPage,
    reload,
  } = useProjects();

  // Client list for the project form dropdown
  const [allClients, setAllClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // AI Description Generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  // Fetch clients for dropdown selector
  const loadClientOptions = async () => {
    setClientsLoading(true);
    try {
      const response = await getClients({ all: 'true', paginate: 'false' });
      if (response.success && response.data) {
        setAllClients(response.data);
      }
    } catch {
      // Ignore background failure, will retry when opening modal
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    loadClientOptions();
  }, []);

  const openCreateModal = () => {
    loadClientOptions();
    setEditingProject(null);
    setFormData({
      ...initialFormData,
      client_id: allClients.length > 0 ? allClients[0].id : '',
    });
    setFieldErrors({});
    setAiError(null);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    loadClientOptions();
    setEditingProject(project);
    setFormData({
      client_id: project.client_id || '',
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'pending',
      start_date: project.start_date || '',
      deadline: project.deadline || '',
    });
    setFieldErrors({});
    setAiError(null);
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // AI generation handler
  const handleGenerateAiDescription = async () => {
    if (!formData.name.trim()) {
      setAiError('Please enter a project name first to generate an AI description.');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    // Find selected client name
    const selectedClient = allClients.find((c) => String(c.id) === String(formData.client_id));
    const clientName = selectedClient ? (selectedClient.company || selectedClient.name) : null;

    try {
      const response = await generateAiDescription(formData.name, clientName);
      if (response.success && response.data?.description) {
        setFormData((prev) => ({
          ...prev,
          description: response.data.description,
        }));
      }
    } catch (err) {
      setAiError(
        err.response?.data?.message || 'AI service unavailable or API key not configured.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    // Client-side date check
    if (formData.start_date && formData.deadline && formData.deadline < formData.start_date) {
      setFieldErrors({
        deadline: ['The deadline must be a date after or equal to start date.'],
      });
      setSubmitting(false);
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        setAlertMessage({ type: 'success', text: 'Project updated successfully.' });
      } else {
        await createProject(formData);
        setAlertMessage({ type: 'success', text: 'Project created successfully.' });
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setAlertMessage({
          type: 'error',
          text: err.response?.data?.message || 'An error occurred while saving the project.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);

    try {
      await deleteProject(projectToDelete.id);
      setAlertMessage({ type: 'success', text: 'Project deleted successfully.' });
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      reload();
    } catch (err) {
      setAlertMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete project.',
      });
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
            Project Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track agency delivery schedules, assignments, and deliverables.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          New Project
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
          placeholder="Search by project name, client, or description..."
          className="w-full sm:w-88"
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
      {!loading && !error && projects.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No projects found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || status !== 'all'
              ? 'No projects match your filter criteria. Try adjusting your search query.'
              : 'You have not created any projects yet. Click below to add your first project.'}
          </p>
          {!search && status === 'all' && (
            <Button variant="primary" icon={Plus} size="sm" onClick={openCreateModal} className="mt-4">
              Add First Project
            </Button>
          )}
        </div>
      )}

      {/* Projects Desktop Table & Mobile Cards */}
      {!loading && !error && projects.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Project Details</th>
                  <th className="py-3.5 px-5">Client</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Timeline</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 max-w-xs">
                      <div className="font-semibold text-slate-900">{project.name}</div>
                      {project.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5 line-clamp-1">
                          {project.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-800">
                        {project.client?.company || project.client?.name || 'Unassigned'}
                      </div>
                      {project.client?.company && (
                        <div className="text-xs text-slate-500">{project.client.name}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <Badge status={project.status} />
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {project.deadline || 'Flexible'}</span>
                      </div>
                      {project.start_date && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Started: {project.start_date}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(project)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(project)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete project"
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
            {projects.map((project) => (
              <div key={project.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{project.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      {project.client?.company || project.client?.name || 'Client'}
                    </p>
                  </div>
                  <Badge status={project.status} />
                </div>

                {project.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Start: {project.start_date || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Due: {project.deadline || 'Open'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => openEditModal(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => confirmDelete(project)}
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

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Assigned Client <span className="text-rose-500">*</span>
            </label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleFormChange}
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select a client...</option>
              {allClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company ? `${c.company} (${c.name})` : c.name}
                </option>
              ))}
            </select>
            {fieldErrors.client_id && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.client_id[0]}</p>
            )}
          </div>

          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="e.g. NextGen Web App Redesign"
            error={fieldErrors.name}
            required
          />

          {/* Description with AI generation button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Project Scope & Description
              </label>

              {/* Bonus AI button */}
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                title="Generate professional description using AI"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="mb-2">
                <Alert
                  type="warning"
                  message={aiError}
                  onClose={() => setAiError(null)}
                />
              </div>
            )}

            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Outline project deliverables, scope, and technical milestones..."
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.description[0]}</p>
            )}
          </div>

          {/* Status & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              {fieldErrors.status && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.status[0]}</p>
              )}
            </div>

            <Input
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleFormChange}
              error={fieldErrors.start_date}
            />

            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleFormChange}
              error={fieldErrors.deadline}
            />
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
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Project Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete project{' '}
            <span className="font-bold text-slate-900">{projectToDelete?.name}</span>?
          </p>
          <p className="text-xs text-slate-500">
            This action cannot be undone.
          </p>

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
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
