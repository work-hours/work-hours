<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Return a list of tags for autocomplete
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $query = $request->input('query', '');
        $user = $request->user();

        $tags = Tag::query()->where('user_id', $user->id)
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->get(['id', 'name'])
            ->unique('name');

        return response()->json($tags);
    }

    /**
     * Store a new tag
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $tag = Tag::firstOrCreate([
            'name' => $validated['name'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json($tag);
    }
}
