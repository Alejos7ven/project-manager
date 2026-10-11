<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\StoreProjectRequest;
use App\Http\Requests\Api\V1\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends BaseApiController
{
    /**
     * Display a listing of projects with search, status filter, client filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->with('client');

        // Filter by search (project name, description, client name)
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('client', function ($clientQuery) use ($search) {
                      $clientQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('company', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Filter by client_id
        if ($clientId = $request->query('client_id')) {
            $query->where('client_id', $clientId);
        }

        $query->latest();

        // Check if pagination is disabled or requested
        if ($request->query('paginate', 'true') === 'false' || $request->query('all') === 'true') {
            $projects = $query->get();
            return $this->successResponse(
                ProjectResource::collection($projects),
                'Projects retrieved successfully.'
            );
        }

        $perPage = (int) $request->query('per_page', 10);
        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ProjectResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'message' => 'Projects retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::create($request->validated());
        $project->load('client');

        return $this->successResponse(
            new ProjectResource($project),
            'Project created successfully.',
            201
        );
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): JsonResponse
    {
        $project->load('client');

        return $this->successResponse(
            new ProjectResource($project),
            'Project details retrieved successfully.'
        );
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());
        $project->load('client');

        return $this->successResponse(
            new ProjectResource($project),
            'Project updated successfully.'
        );
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return $this->successResponse(null, 'Project deleted successfully.');
    }
}
