<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\ClientStore;
use App\Http\Stores\TeamStore;
use App\Models\AiChatHistory;
use App\Models\TimeLog;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Msamgan\Lact\Attributes\Action;

final class AiChatController extends Controller
{
    /**
     * Get all chat histories for the authenticated user
     */
    #[Action(method: 'get', name: 'ai-chat.get-histories', middleware: ['auth', 'verified'])]
    public function getChatHistories(): JsonResponse
    {
        try {
            $histories = AiChatHistory::query()->where('user_id', auth()->id())
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'histories' => $histories,
            ]);
        } catch (Exception $e) {
            Log::error('Error retrieving chat histories', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific chat history by ID
     */
    #[Action(method: 'get', name: 'ai-chat.get-history', middleware: ['auth', 'verified'])]
    public function getChatHistory(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|integer|exists:ai_chat_histories,id',
        ]);

        try {
            $history = AiChatHistory::query()->where('id', $request->id)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'history' => $history,
            ]);
        } catch (Exception $e) {
            Log::error('Error retrieving chat history', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a chat history
     */
    #[Action(method: 'delete', name: 'ai-chat.delete-history', middleware: ['auth', 'verified'])]
    public function deleteChatHistory(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|integer|exists:ai_chat_histories,id',
        ]);

        try {
            $history = AiChatHistory::query()->where('id', $request->id)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $history->delete();

            return response()->json([
                'success' => true,
                'message' => 'Chat history deleted successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Error deleting chat history', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send a message to Google Gemini AI and get a response
     */
    #[Action(method: 'post', name: 'ai-chat.send-message', middleware: ['auth', 'verified'])]
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'context' => ['nullable', 'array'],
            'chat_history_id' => ['nullable', 'integer', 'exists:ai_chat_histories,id'],
        ]);

        try {
            $apiKey = config('services.google_gemini.api_key');

            if (! $apiKey) {
                return response()->json([
                    'success' => false,
                    'message' => 'Google Gemini API key is not configured.',
                ], 500);
            }

            $context = $request->input('context', []);
            $chatHistoryId = $request->input('chat_history_id');
            $userMessage = $request->input('message');

            $prompt = 'You are an AI assistant for a time tracking application. ';
            $prompt .= 'The user is asking about their time tracking data. ';

            if (! empty($context)) {
                $prompt .= "Here is some context about the user's data:\n";
                if (! empty($context['projects'])) {
                    $prompt .= 'Project data: ' . json_encode($context['projects']) . "\n";
                }
                $prompt .= "\n";
            }

            $team = TeamStore::teamMembers(userId: auth()->id(), map: false);
            if ($team->isNotEmpty()) {
                $prompt .= "Here is the user's team data:\n";
                $prompt .= json_encode($team->toArray()) . "\n";
            }

            $clients = ClientStore::userClients(auth()->id());
            if ($clients->isNotEmpty()) {
                $prompt .= "Here is the user's client data:\n";
                $prompt .= json_encode($clients->toArray()) . "\n";
            }

            $myTimeLogs = TimeLog::query()
                ->with('project', 'user', 'task')
                ->where('user_id', auth()->id())
                ->get();

            if ($myTimeLogs->isNotEmpty()) {
                $prompt .= "Here is the user's time log data:\n";
                $prompt .= json_encode($myTimeLogs->toArray()) . "\n";
            }

            if (! empty($context['messages'])) {
                $prompt .= 'conversation data: ' . json_encode($context['messages']) . "\n";
            }
            $prompt .= "\n";

            $prompt .= "User's question: " . $userMessage;

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

            $aiResponse = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, I could not generate a response.';

            $messages = [];
            $chatHistory = null;

            if ($chatHistoryId) {
                $chatHistory = AiChatHistory::query()->where('id', $chatHistoryId)
                    ->where('user_id', auth()->id())
                    ->first();

                if ($chatHistory) {
                    $messages = $chatHistory->messages;
                }
            }

            $messages[] = [
                'id' => uniqid(),
                'content' => $userMessage,
                'isUser' => true,
                'timestamp' => now()->toIso8601String(),
            ];

            $messages[] = [
                'id' => uniqid(),
                'content' => $aiResponse,
                'isUser' => false,
                'timestamp' => now()->toIso8601String(),
            ];

            if ($chatHistory) {
                $chatHistory->update([
                    'messages' => $messages,
                ]);
            } else {

                $title = mb_strlen((string) $userMessage) > 50
                    ? mb_substr((string) $userMessage, 0, 47) . '...'
                    : $userMessage;

                $chatHistory = AiChatHistory::query()->create([
                    'user_id' => auth()->id(),
                    'title' => $title,
                    'messages' => $messages,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => $aiResponse,
                'chat_history_id' => $chatHistory->id,
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
