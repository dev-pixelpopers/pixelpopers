<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * An email address signed up through the footer or blog newsletter form.
 */
class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'email',
        'source',
        'unsubscribed_at',
        'ip_address',
    ];

    protected $casts = [
        'unsubscribed_at' => 'datetime',
    ];
}
