<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\GenerateAiDescriptionRequest;
use App\Services\AiDescriptionService;
use Illuminate\Http\JsonResponse;

class AiController extends BaseApiController
{
    /**
     * Generate an AI-assisted project description.
     */
    public function generateDescription(
        GenerateAiDescriptionRequest $request,
        AiDescriptionService $aiService
    ): JsonResponse {
        $apiKey = config('services.gemini.key');

        if (empty($apiKey)) {
            return $this->errorResponse(
                'AI service is currently unavailable: GEMINI_API_KEY is not configured in .env.',
                null,
                503
            );
        }

        $validated = $request->validated();
        $description = $aiService->generate(
            $validated['project_name'],
            $validated['client_name'] ?? null
        );

        if (! $description) {
            return $this->errorResponse(
                'Failed to generate description from AI service. Please verify your API key or network connection.',
                null,
                503
            );
        }

        return $this->successResponse([
            'description' => $description,
        ], 'Project description generated successfully.');
    }
}
