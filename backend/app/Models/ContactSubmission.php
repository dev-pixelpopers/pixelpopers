<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A project enquiry from the contact form.
 */
class ContactSubmission extends Model
{
    protected $fillable = [
        'name',
        'email',
        'company',
        'website',
        'services',
        'budget',
        'details',
        'status',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'services' => 'array',
    ];

    public const STATUSES = [
        'new' => 'New',
        'read' => 'Read',
        'contacted' => 'Contacted',
        'won' => 'Won',
        'lost' => 'Lost',
        'archived' => 'Archived',
    ];
}
