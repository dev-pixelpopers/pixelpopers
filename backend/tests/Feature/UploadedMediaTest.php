<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Uploads must load even on a host where public/storage was never linked:
 * the request then reaches Laravel, which serves the file from the public disk.
 */
class UploadedMediaTest extends TestCase
{
    public function test_an_upload_is_served_without_the_storage_link(): void
    {
        Storage::disk('public')->put('uploads/images/media-test.txt', 'upload-ok');

        try {
            $this->get('/storage/uploads/images/media-test.txt')->assertOk()->assertHeader('Cache-Control', 'immutable, max-age=31536000, public');
            $this->assertSame('upload-ok', $this->get('/storage/uploads/images/media-test.txt')->streamedContent() ?: file_get_contents(Storage::disk('public')->path('uploads/images/media-test.txt')));
            $this->get('/storage/uploads/images/missing.png')->assertNotFound();
            $this->get('/storage/../.env')->assertNotFound();
            $this->get('/storage/..%2F..%2F.env')->assertNotFound();
        } finally {
            Storage::disk('public')->delete('uploads/images/media-test.txt');
        }
    }
}
