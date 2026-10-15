<?php

use Illuminate\Support\Facades\Route;

// The public website is the Next.js app; this server only hosts the CMS and its API.
Route::redirect('/', '/admin');
