<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /** The backend has no public site: its root sends visitors to the CMS. */
    public function test_the_root_redirects_to_the_admin(): void
    {
        $this->get('/')->assertRedirect('/admin');
    }
}
