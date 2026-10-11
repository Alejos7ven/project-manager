<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiDescriptionService
{
    /**
     * Generate an engaging project scope and description using AI.
     */
    public function generate(string $projectName, ?string $clientName = null): ?string
    {
        $apiKey = config('services.gemini.key');

        if (empty($apiKey)) {
            return null;
        }

        $prompt = "Write a professional, concise, and structured project description (around 2-3 sentences, outlining objective, scope, and key deliverables) for a digital agency project named '{$projectName}'" .
            ($clientName ? " for client '{$clientName}'." : ".");

        try {
            $response = Http::timeout(10)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}",
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                return $text ? trim($text) : null;
            }

            Log::warning('Gemini API call returned non-200 status', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('Exception while calling Gemini API: '.$e->getMessage());
            return null;
        }
    }
}
