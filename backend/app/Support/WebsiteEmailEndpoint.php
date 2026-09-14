<?php

namespace App\Support;

use App\Services\WebsiteEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

class WebsiteEmailEndpoint
{
    public static function send(Request $request, string $route): JsonResponse
    {
        WebsiteEmailDebug::step('route reached', WebsiteEmailDebug::requestContext($request, $route));

        try {
            WebsiteEmailDebug::step('validation starting', [
                'type' => $request->input('type'),
                'email' => $request->input('email'),
            ]);

            $validated = $request->validate([
                'type' => ['required', 'string', Rule::in(['contact', 'unsubscribe', 'subscription'])],
                'name' => ['required_unless:type,subscription', 'nullable', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'phone' => ['required_if:type,unsubscribe', 'nullable', 'string', 'max:30'],
                'message' => ['required_if:type,contact', 'nullable', 'string', 'max:5000'],
            ]);

            WebsiteEmailDebug::step('validation passed', [
                'type' => $validated['type'],
                'validated_keys' => array_keys($validated),
            ]);
        } catch (ValidationException $exception) {
            WebsiteEmailDebug::error('validation failed', $exception, [
                'errors' => $exception->errors(),
            ]);

            throw $exception;
        }

        try {
            WebsiteEmailDebug::step('mail send starting', [
                'type' => $validated['type'],
                'mail_config' => WebsiteEmailDebug::mailConfigContext(),
            ]);

            app(WebsiteEmailService::class)->send($validated['type'], $validated);

            WebsiteEmailDebug::step('mail send completed', [
                'type' => $validated['type'],
            ]);
        } catch (Throwable $exception) {
            report($exception);
            WebsiteEmailDebug::error('mail send failed', $exception, [
                'type' => $validated['type'],
                'mail_config' => WebsiteEmailDebug::mailConfigContext(),
            ]);

            return response()->json([
                'error' => config('app.debug')
                    ? $exception->getMessage()
                    : 'Failed to send email. Please try again later.',
                'debug_step' => 'mail send failed',
            ], 500);
        }

        return response()->json([
            'message' => 'Email sent successfully.',
        ]);
    }
}
