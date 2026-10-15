<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// The public website is the Next.js app; this server only hosts the CMS and its API.
Route::redirect('/', '/admin');

// Uploaded media (/storage/uploads/…) is normally served straight from the
// public/storage link (`php artisan storage:link`). On hosts where that link
// is missing or can't be created, the request reaches Laravel instead, and
// this serves the file from the public disk.
Route::get('/storage/{path}', function (string $path) {
    $disk = Storage::disk('public');
    $root = realpath($disk->path(''));
    $file = realpath($disk->path($path));

    abort_unless($root && $file && str_starts_with($file, $root.DIRECTORY_SEPARATOR) && is_file($file), 404);

    return response()->file($file, ['Cache-Control' => 'public, max-age=31536000, immutable']);
})->where('path', '.*')->name('storage.public');
