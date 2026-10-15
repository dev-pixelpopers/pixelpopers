<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Sends mail with the SMTP account saved under Site Settings → Email, so the
 * studio can change mail providers without touching the server's .env.
 */
class Mailer
{
    /** @param  array<string, mixed>|null  $overrides unsaved form values (for the test button) */
    public static function configure(?array $overrides = null): bool
    {
        $get = fn (string $key, mixed $default = null) => ($overrides[$key] ?? null) !== null && ($overrides[$key] ?? '') !== ''
            ? $overrides[$key]
            : Setting::get($key, $default);

        $host = (string) $get('smtp_host', '');
        $username = (string) $get('smtp_username', '');
        if ($host === '' || $username === '') {
            return false;
        }

        $encryption = (string) $get('smtp_encryption', 'tls');
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $host,
            'mail.mailers.smtp.port' => (int) $get('smtp_port', 587),
            'mail.mailers.smtp.scheme' => $encryption === 'ssl' ? 'smtps' : null,
            'mail.mailers.smtp.username' => $username,
            'mail.mailers.smtp.password' => (string) $get('smtp_password', ''),
            'mail.from.address' => (string) $get('mail_from_address', config('mail.from.address')),
            'mail.from.name' => (string) $get('mail_from_name', config('mail.from.name')),
        ]);
        Mail::purge('smtp');

        return true;
    }

    /** Emails the studio inbox (Site Settings → Email → notifications address). Never throws. */
    public static function notifyStudio(string $subject, string $body): void
    {
        $to = (string) Setting::get('mail_to_address', Setting::get('company_email', ''));
        if ($to === '' || ! self::configure()) {
            return;
        }

        try {
            Mail::raw($body, fn ($message) => $message->to($to)->subject($subject));
        } catch (Throwable $exception) {
            Log::warning('Studio notification email failed.', ['subject' => $subject, 'error' => $exception->getMessage()]);
        }
    }
}
