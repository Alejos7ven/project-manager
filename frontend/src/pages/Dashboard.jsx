import React from 'react';
import { Link } from 'react-router-dom';
import useDashboardStats from '../hooks/useDashboardStats';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Alert from '../components/Alert';
import {
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Calendar,
  Building,
} from 'lucide-react';

const Dashboard = () => {
  const { stats, loading, error, reload } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Skeleton Header */}
        <div className="h-8 bg-slate-200 rounded-md w-64 mb-6"></div>

        {/* Skeleton StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 p-5">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="h-64 bg-white rounded-xl border border-slate-200 p-5"></div>
          <div className="h-64 bg-white rounded-xl border border-slate-200 p-5"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert
          type="error"
          title="Could not load dashboard statistics"
          message={error}
        />
        <Button variant="secondary" icon={RefreshCw} onClick={reload}>
          Retry
        </Button>
      </div>
    );
  }

  const {
    total_clients = 0,
    active_projects = 0,
    completed_projects = 0,
    pending_projects = 0,
    recent_projects = [],
    recent_clients = [],
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xs text-indigo-100 mb-2">
            Agency Control Center
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white m-0 tracking-tight">
            Projects & Operations Overview
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Monitor client engagements, track milestone timelines, and manage project lifecycles in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/clients">
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Add Client
            </Button>
          </Link>
          <Link to="/projects">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-md font-semibold"
            >
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <StatCard
          title="Total Clients"
          value={total_clients}
          icon={Users}
          color="indigo"
          subtitle="Registered agency partners"
        />
        <StatCard
          title="Active Projects"
          value={active_projects}
          icon={FolderKanban}
          color="blue"
          subtitle="In active sprint execution"
        />
        <StatCard
          title="Completed Projects"
          value={completed_projects}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Delivered and archived"
        />
        <StatCard
          title="Pending Projects"
          value={pending_projects}
          icon={Clock}
          color="amber"
          subtitle="Awaiting kickoff or scope"
        />
      </div>

      {/* Split Section: Recent Projects & Recent Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 m-0">Recent Projects</h3>
              </div>
              <Link
                to="/projects"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recent_projects.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No projects recorded yet.
                </div>
              ) : (
                recent_projects.map((project) => (
                  <div key={project.id} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 truncate">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {project.client?.company || project.client?.name || 'Client'}
                        </span>
                        {project.deadline && (
                          <span className="flex items-center gap-1 text-slate-400">
                            • <Calendar className="w-3.5 h-3.5" /> {project.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge status={project.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 m-0">Recent Clients</h3>
              </div>
              <Link
                to="/clients"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recent_clients.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No clients recorded yet.
                </div>
              ) : (
                recent_clients.map((client) => (
                  <div key={client.id} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {client.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {client.company ? `${client.company} • ` : ''}
                        {client.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {client.projects_count ?? 0} {client.projects_count === 1 ? 'project' : 'projects'}
                      </span>
                      <Badge status={client.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
