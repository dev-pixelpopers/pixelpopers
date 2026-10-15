<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use Illuminate\Database\Eloquent\Model;

/**
 * A client quote, shown in the "Kind words" sections. `tone` picks the card colours.
 */
class Testimonial extends Model
{
    use IsContent;

    protected $fillable = [
        'quote',
        'role',
        'company',
        'initial',
        'tone',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
