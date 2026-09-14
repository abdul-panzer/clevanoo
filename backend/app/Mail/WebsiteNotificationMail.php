<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WebsiteNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $type,
        public string $subjectLine,
        public array $payload,
        public ?string $replyToAddress = null,
        public ?string $replyToName = null,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
            replyTo: $this->replyToAddress
                ? [new Address($this->replyToAddress, $this->replyToName)]
                : [],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.website-notification',
            with: [
                'type' => $this->type,
                'subjectLine' => $this->subjectLine,
                'payload' => $this->payload,
            ],
        );
    }
}
