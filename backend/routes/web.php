<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/website-email', function (Request $request) {
    \Illuminate\Support\Facades\Log::info('[WebsiteEmail] route reached', [
        'route' => 'web.php:/api/website-email',
        'method' => $request->method(),
        'path' => $request->path(),
        'origin' => $request->headers->get('origin'),
        'content_type' => $request->headers->get('content-type'),
        'payload' => $request->except(['password']),
    ]);

    try {
        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] validation starting');

        $validated = $request->validate([
            'type' => ['required', 'string', \Illuminate\Validation\Rule::in(['contact', 'unsubscribe', 'subscription'])],
            'name' => ['required_unless:type,subscription', 'nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required_if:type,unsubscribe', 'nullable', 'string', 'max:30'],
            'message' => ['required_if:type,contact', 'nullable', 'string', 'max:5000'],
        ]);

        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] validation passed', [
            'type' => $validated['type'],
        ]);

        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] mail send starting', [
            'mail_default' => config('mail.default'),
            'mail_host' => config('mail.mailers.smtp.host'),
            'mail_port' => config('mail.mailers.smtp.port'),
            'mail_scheme' => config('mail.mailers.smtp.scheme'),
            'mail_username_set' => filled(config('mail.mailers.smtp.username')),
            'mail_password_set' => filled(config('mail.mailers.smtp.password')),
            'mail_from' => config('mail.from.address'),
            'website_mail_to' => config('services.website_mail.to'),
        ]);

        app(\App\Services\WebsiteEmailService::class)->send($validated['type'], $validated);

        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] mail send completed');

        return response()->json([
            'message' => 'Email sent successfully.',
        ]);
    } catch (\Throwable $exception) {
        \Illuminate\Support\Facades\Log::error('[WebsiteEmail] failed', [
            'exception_class' => $exception::class,
            'exception_message' => $exception->getMessage(),
            'exception_file' => $exception->getFile(),
            'exception_line' => $exception->getLine(),
        ]);

        return response()->json([
            'error' => config('app.debug') ? $exception->getMessage() : 'Failed to send email. Please try again later.',
        ], 500);
    }
});
