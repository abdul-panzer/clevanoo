<?php

namespace App\Services;

use App\Mail\WebsiteNotificationMail;
use App\Support\WebsiteEmailDebug;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;

class WebsiteEmailService
{
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
        if ($this->shouldDebug($type)) {
            WebsiteEmailDebug::step('service entered', [
                'type' => $type,
                'data_keys' => array_keys($data),
            ]);
        }

        if (! array_key_exists($type, self::TYPES)) {
            throw new InvalidArgumentException("Unsupported website email type [{$type}].");
        }

        $definition = self::TYPES[$type];
        $payload = [
            'title' => $definition['title'],
            'fields' => $this->formatFields($definition['fields'], $data),
        ];

        $replyTo = filter_var($data['email'] ?? null, FILTER_VALIDATE_EMAIL) ?: null;
        $replyToName = $data['name'] ?? trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
        $replyToName = $replyToName !== '' ? $replyToName : null;
        $recipient = $this->recipient();

        if ($this->shouldDebug($type)) {
            WebsiteEmailDebug::step('mail object prepared', [
                'type' => $type,
                'subject' => $definition['subject'],
                'recipient' => $recipient,
                'reply_to' => $replyTo,
                'field_count' => count($payload['fields']),
            ]);
        }

        Mail::to($recipient)->send(
            new WebsiteNotificationMail(
                type: $type,
                subjectLine: $definition['subject'],
                payload: $payload,
                replyToAddress: $replyTo,
                replyToName: $replyToName,
            )
        );

        if ($this->shouldDebug($type)) {
            WebsiteEmailDebug::step('mail facade send returned', [
                'type' => $type,
                'recipient' => $recipient,
            ]);
        }
    }

    private function recipient(): string
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

    private function shouldDebug(string $type): bool
    {
        return in_array($type, ['contact', 'unsubscribe', 'subscription'], true);
    }
}
