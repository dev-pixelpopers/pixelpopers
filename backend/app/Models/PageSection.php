<?php

namespace App\Models;

use App\Models\Concerns\IsContent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

/**
 * One section of a page's copy (e.g. About → Values). `content` is the copy
 * itself; `schema` is the field layout its admin form is built from, inferred
 * from the content it was seeded with (see App\Filament\Support\ContentForm).
 */
class PageSection extends Model
{
    use IsContent;

    protected $fillable = [
        'page_id',
        'key',
        'label',
        'content',
        'schema',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'content' => 'array',
        'schema' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
