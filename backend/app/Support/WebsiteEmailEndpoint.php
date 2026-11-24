<?php

namespace App\Support;

use App\Services\WebsiteEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class WebsiteEmailEndpoint
{
    public static function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', Rule::in(['contact', 'unsubscribe', 'subscription'])],
            'name' => ['required_unless:type,subscription', 'nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required_if:type,unsubscribe', 'nullable', 'string', 'max:30'],
            'message' => ['required_if:type,contact', 'nullable', 'string', 'max:5000'],
        ]);

        try {
            app(WebsiteEmailService::class)->send($data['type'], $data);
        } catch (Throwable $exception) {
            Log::error('Website email could not be sent.', [
                'type' => $data['type'],
                'exception_type' => $exception::class,
            ]);

            return response()->json(['error' => 'Failed to send email. Please try again later.'], 502);
        }

        return response()->json(['message' => 'Email sent successfully.']);
    }
}
