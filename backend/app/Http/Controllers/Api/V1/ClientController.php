<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\StoreClientRequest;
use App\Http\Requests\Api\V1\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends BaseApiController
{
    /**
     * Display a listing of clients with search, filtering, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Client::query()->withCount('projects');

        // Filter by search (name, email, company)
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $query->latest();

        // Check if pagination is disabled or requested
        if ($request->query('paginate', 'true') === 'false' || $request->query('all') === 'true') {
            $clients = $query->get();
            return $this->successResponse(
                ClientResource::collection($clients),
                'Clients retrieved successfully.'
            );
        }

        $perPage = (int) $request->query('per_page', 10);
        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ClientResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'message' => 'Clients retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(StoreClientRequest $request): JsonResponse
    {
        $client = Client::create($request->validated());

        return $this->successResponse(
            new ClientResource($client),
            'Client created successfully.',
            201
        );
    }

    /**
     * Display the specified client with associated projects.
     */
    public function show(Client $client): JsonResponse
    {
        $client->load('projects');

        return $this->successResponse(
            new ClientResource($client),
            'Client details retrieved successfully.'
        );
    }

    /**
     * Update the specified client.
     */
    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $client->update($request->validated());

        return $this->successResponse(
            new ClientResource($client),
            'Client updated successfully.'
        );
    }

    /**
     * Remove the specified client if it has no associated projects.
     */
    public function destroy(Client $client): JsonResponse
    {
        if ($client->projects()->exists()) {
            return $this->errorResponse(
                'Cannot delete client with existing projects. Please reassign or delete projects first.',
                null,
                409
            );
        }

        $client->delete();

        return $this->successResponse(null, 'Client deleted successfully.');
    }
}
