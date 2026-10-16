<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

/**
 * Every form reaches the CMS from the website's server, so the spam limit and
 * the stored address must follow the visitor the website vouches for — and
 * only when it signs the request with the shared secret.
 */
class FormVisitorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Setting::set('frontend_revalidate_secret', 'shared-test-secret');
        RateLimiter::clear('forms');
    }

    private function subscribe(string $email, array $headers = [])
    {
        return $this->withHeaders($headers)->postJson('/api/v1/newsletter', ['email' => $email, 'source' => 'footer']);
    }

    public function test_each_visitor_has_their_own_limit_when_the_website_vouches_for_them(): void
    {
        foreach (range(1, 8) as $i) {
            $this->subscribe("v{$i}@pp.test", ['X-Site-Key' => 'shared-test-secret', 'X-Visitor-Ip' => "203.0.113.{$i}"])->assertCreated();
        }
        $this->assertSame('203.0.113.3', NewsletterSubscriber::where('email', 'v3@pp.test')->value('ip_address'));
    }

    public function test_one_visitor_is_still_limited(): void
    {
        $as = ['X-Site-Key' => 'shared-test-secret', 'X-Visitor-Ip' => '198.51.100.7'];
        foreach (range(1, 5) as $i) {
            $this->subscribe("same{$i}@pp.test", $as)->assertCreated();
        }
        $this->subscribe('same6@pp.test', $as)->assertStatus(429);
    }

    public function test_a_forwarded_address_without_the_secret_is_ignored(): void
    {
        foreach (range(1, 5) as $i) {
            $this->subscribe("spoof{$i}@pp.test", ['X-Site-Key' => 'wrong', 'X-Visitor-Ip' => "192.0.2.{$i}"])->assertCreated();
        }
        // All five counted against the real address, so the sixth is refused.
        $this->subscribe('spoof6@pp.test', ['X-Visitor-Ip' => '192.0.2.99'])->assertStatus(429);
        $this->assertSame('127.0.0.1', NewsletterSubscriber::where('email', 'spoof1@pp.test')->value('ip_address'));
    }
}
