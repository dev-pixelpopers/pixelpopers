<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use Illuminate\Database\Eloquent\Model;

/**
 * A client logo in the home page's Agency folder. `tint` paints light-on-
 * transparent marks as a solid colour through an alpha mask.
 */
class Client extends Model
{
    use IsContent;

    protected $fillable = [
        'name',
        'logo',
        'width',
        'height',
        'tint',
        'rotate',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'width' => 'integer',
        'height' => 'integer',
        'rotate' => 'float',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];
}
