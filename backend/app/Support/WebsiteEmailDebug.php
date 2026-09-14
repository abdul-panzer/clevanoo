<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebsiteEmailDebug
{
    private const PREFIX = '[WebsiteEmail]';

    public static function step(string $step, array $context = []): void
    {
        Log::info(self::PREFIX . ' ' . $step, self::sanitize($context));
    }

    public static function error(string $step, \Throwable $exception, array $context = []): void
    {
        Log::error(self::PREFIX . ' ' . $step, self::sanitize([
            ...$context,
            'exception_class' => $exception::class,
            'exception_message' => $exception->getMessage(),
            'exception_file' => $exception->getFile(),
            'exception_line' => $exception->getLine(),
        ]));
    }

    public static function requestContext(Request $request, string $route): array
    {
        return [
            'route' => $route,
            'method' => $request->method(),
            'path' => $request->path(),
            'url' => $request->fullUrl(),
            'origin' => $request->headers->get('origin'),
            'content_type' => $request->headers->get('content-type'),
            'accept' => $request->headers->get('accept'),
            'ip' => $request->ip(),
            'payload_keys' => array_keys($request->all()),
            'payload' => $request->except(['password', 'MAIL_PASSWORD']),
        ];
    }

    public static function mailConfigContext(): array
    {
        return [
            'default_mailer' => config('mail.default'),
            'smtp_host' => config('mail.mailers.smtp.host'),
            'smtp_port' => config('mail.mailers.smtp.port'),
            'smtp_scheme' => config('mail.mailers.smtp.scheme'),
            'smtp_username_set' => filled(config('mail.mailers.smtp.username')),
            'smtp_password_set' => filled(config('mail.mailers.smtp.password')),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'website_mail_to' => config('services.website_mail.to'),
            'app_debug' => config('app.debug'),
            'app_url' => config('app.url'),
        ];
    }

    private static function sanitize(array $context): array
    {
        array_walk_recursive($context, function (&$value, $key) {
            if (is_string($key) && str_contains(strtolower($key), 'password')) {
                $value = filled($value) ? '[set]' : '[empty]';
            }
        });

        return $context;
    }
}
