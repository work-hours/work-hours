<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Msamgan\Lact\Attributes\Action;

final class AiChatController extends Controller
{
    /**
     * Send a message to Google Gemini AI and get a response
     */
    #[Action(method: 'post', name: 'ai-chat.send-message', middleware: ['auth', 'verified'])]
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'context' => 'nullable|array',
        ]);

        try {
            $apiKey = config('services.google_gemini.api_key');

            if (! $apiKey) {
                return response()->json([
                    'success' => false,
                    'message' => 'Google Gemini API key is not configured.',
                ], 500);
            }

            // Prepare context data
            $context = $request->input('context', []);

            // Build the prompt with context
            $prompt = 'You are an AI assistant for a time tracking application. ';
            $prompt .= 'The user is asking about their time tracking data. ';

            if (! empty($context)) {
                $prompt .= "Here is some context about the user's data:\n";
                if (! empty($context['projects'])) {
                    $prompt .= 'Project data: ' . json_encode($context['projects']) . "\n";
                }
                $prompt .= "\n";
                if (! empty($context['messages'])) {
                    $prompt .= 'conversation data: ' . json_encode($context['messages']) . "\n";
                }
                $prompt .= "\n";
            }

            $prompt .= "User's question: " . $request->input('message');

            // Call Google Gemini API
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'X-goog-api-key' => $apiKey,
            ])->post('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 1024,
                ],
            ]);

            if ($response->failed()) {
                Log::error('Google Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Failed to get response from Google Gemini API: ' . $response->body(),
                ], 500);
            }

            $responseData = $response->json();

            // Extract the text response from the Gemini API response
            $aiResponse = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, I could not generate a response.';

            return response()->json([
                'success' => true,
                'message' => $aiResponse,
            ]);
        } catch (Exception $e) {
            Log::error('AI Chat error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
}
