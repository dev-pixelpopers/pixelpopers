<?php

namespace App\Models\Concerns;

/**
 * Keeps JSON content in the frontend's shape when it's saved from the admin.
 *
 * Forms submit every field they show, so an optional key the content leaves
 * out (an image's focal point, a package's "popular" flag) comes back as null
 * or false. The website's types treat those keys as optional, so they're
 * dropped again on save rather than stored as noise.
 */
trait PrunesOptionalJson
{
    /** Optional flags that mean the same as "absent" when false. */
    private static array $falseMeansAbsent = ['popular', 'dark', 'featured'];

    public static function bootPrunesOptionalJson(): void
    {
        static::saving(function (self $model): void {
            foreach ($model->getCasts() as $attribute => $cast) {
                if ($cast === 'array' && $model->isDirty($attribute) && is_array($model->{$attribute})) {
                    $model->{$attribute} = self::prune($model->{$attribute});
                }
            }
        });
    }

    private static function prune(array $value): array
    {
        $isList = array_is_list($value);
        $out = [];
        foreach ($value as $key => $item) {
            // An object whose fields were all empty (e.g. a tile with no dot)
            // is absent too; an empty list stays an empty list.
            $wasObject = is_array($item) && $item !== [] && ! array_is_list($item);
            if (is_array($item)) {
                $item = self::prune($item);
            }
            $absent = ! $isList && ($item === null
                || ($item === false && in_array($key, self::$falseMeansAbsent, true))
                || ($wasObject && $item === []));
            if (! $absent) {
                $out[$key] = $item;
            }
        }

        return $isList ? array_values($out) : $out;
    }
}
