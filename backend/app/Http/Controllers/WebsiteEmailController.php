<?php

namespace App\Http\Controllers;

use App\Services\WebsiteEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Throwable;

class WebsiteEmailController extends Controller
{
    public function __construct(private WebsiteEmailService $websiteEmailService)
    {
    }

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['contact', 'unsubscribe', 'subscription'])],
            'name' => ['required_unless:type,subscription', 'nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required_if:type,unsubscribe', 'nullable', 'string', 'max:30'],
            'message' => ['required_if:type,contact', 'nullable', 'string', 'max:5000'],
        ]);

        try {
            $this->websiteEmailService->send($validated['type'], $validated);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'error' => 'Failed to send email. Please try again later.',
            ], 500);
        }

        return response()->json([
            'message' => 'Email sent successfully.',
        ]);
    }
}
