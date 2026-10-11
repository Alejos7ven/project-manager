<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ClientResource;
use App\Http\Resources\ProjectResource;
use App\Models\Client;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class DashboardController extends BaseApiController
{
    /**
     * Retrieve aggregated statistics and recent records for the dashboard.
     */
    public function stats(): JsonResponse
    {
        $totalClients = Client::count();
        $activeProjects = Project::where('status', 'active')->count();
        $completedProjects = Project::where('status', 'completed')->count();
        $pendingProjects = Project::where('status', 'pending')->count();

        $recentProjects = Project::with('client')
            ->latest()
            ->take(5)
            ->get();

        $recentClients = Client::withCount('projects')
            ->latest()
            ->take(5)
            ->get();

        return $this->successResponse([
            'total_clients' => $totalClients,
            'active_projects' => $activeProjects,
            'completed_projects' => $completedProjects,
            'pending_projects' => $pendingProjects,
            'recent_projects' => ProjectResource::collection($recentProjects),
            'recent_clients' => ClientResource::collection($recentClients),
        ], 'Dashboard statistics retrieved successfully.');
    }
}
