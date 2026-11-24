<?php

namespace App\Services;

use App\Mail\WebsiteNotificationMail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;
use RuntimeException;

class WebsiteEmailService
{
    private const DUPLICATE_WINDOW_SECONDS = 600;

    private const TYPES = [
        'contact' => [
            'subject' => 'New website contact message',
            'title' => 'Contact Form Submission',
            'fields' => [
                'name' => 'Name',
                'email' => 'Email',
                'message' => 'Message',
            ],
        ],
        'unsubscribe' => [
            'subject' => 'New unsubscribe request',
            'title' => 'Unsubscribe Request',
            'fields' => [
                'name' => 'Name',
                'email' => 'Email',
                'phone' => 'Phone',
            ],
        ],
        'subscription' => [
            'subject' => 'New job alerts subscription',
            'title' => 'Job Alerts Subscription',
            'fields' => [
                'email' => 'Email',
            ],
        ],
        'candidate_application' => [
            'subject' => 'New candidate application',
            'title' => 'Candidate Application',
            'fields' => [
                'first_name' => 'First Name',
                'last_name' => 'Last Name',
                'email' => 'Email',
                'phone' => 'Phone',
                'position_applied_for' => 'Position Applied For',
                'visa_type' => 'Visa Type',
                'state' => 'State',
                'resume_url' => 'Resume',
                'message' => 'Message',
            ],
        ],
    ];

    public function send(string $type, array $data): void
    {
        $definition = self::TYPES[$type] ?? throw new InvalidArgumentException('Unsupported website email type.');
        $key = 'website-email:'.$this->fingerprint($type, $data);

        Cache::lock($key.':lock', 90)->block(10, function () use ($key, $type, $data, $definition): void {
            if (Cache::has($key)) {
                return;
            }

            $recipient = $this->recipient();
            if (! filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                throw new RuntimeException('The website mail recipient is not configured.');
            }
            $replyTo = filter_var($data['email'] ?? null, FILTER_VALIDATE_EMAIL) ?: null;
            $replyToName = $data['name'] ?? trim(($data['first_name'] ?? '').' '.($data['last_name'] ?? ''));
            $sent = Mail::to($recipient)->send(new WebsiteNotificationMail(
                type: $type,
                subjectLine: $definition['subject'],
                payload: [
                    'title' => $definition['title'],
                    'fields' => $this->formatFields($definition['fields'], $data),
                ],
                replyToAddress: $replyTo,
                replyToName: $replyToName ?: null,
            ));
            if (! $sent) {
                throw new RuntimeException('The mail transport did not send the message.');
            }
            Cache::put($key, true, self::DUPLICATE_WINDOW_SECONDS);
        });
    }

    private function fingerprint(string $type, array $data): string
    {
        return hash('sha256', json_encode([
            'type' => $type,
            'candidate_id' => $data['candidate_id'] ?? null,
            'email' => strtolower(trim((string) ($data['email'] ?? ''))),
            'name' => strtolower(trim((string) ($data['name'] ?? ''))),
            'phone' => preg_replace('/\D+/', '', (string) ($data['phone'] ?? '')),
            'message' => preg_replace('/\s+/', ' ', trim((string) ($data['message'] ?? ''))),
            'first_name' => strtolower(trim((string) ($data['first_name'] ?? ''))),
            'last_name' => strtolower(trim((string) ($data['last_name'] ?? ''))),
            'position_applied_for' => strtolower(trim((string) ($data['position_applied_for'] ?? ''))),
        ]));
    }

    private function recipient(): ?string
    {
        return config('services.website_mail.to')
            ?: config('mail.from.address');
    }

    private function formatFields(array $fields, array $data): array
    {
        $formatted = [];

        foreach ($fields as $key => $label) {
            $value = $data[$key] ?? null;

            if ($value === null || $value === '') {
                continue;
            }

            $formatted[] = [
                'label' => $label,
                'value' => $value,
                'is_url' => is_string($value) && filter_var($value, FILTER_VALIDATE_URL),
            ];
        }

        return $formatted;
    }

}

