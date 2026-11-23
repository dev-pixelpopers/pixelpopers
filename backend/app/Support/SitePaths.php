<?php

namespace App\Support;

use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Support\Facades\Schema;

/**
 * Every page of the website as path → label, for pickers in the admin
 * (Scripts → "Add to", Redirects → "Send visitors to").
 */
class SitePaths
{
    /** @return array<string, string> */
    public static function all(): array
    {
        $paths = [
            '/' => 'Home',
            '/work' => 'Work',
            '/services' => 'Services',
            '/about' => 'About',
            '/blog' => 'Blog',
            '/contact' => 'Contact',
        ];

        $add = function (string $model, string $prefix, string $group, string $labelColumn) use (&$paths): void {
            if (! Schema::hasTable((new $model)->getTable())) {
                return;
            }
            $model::query()->orderBy($labelColumn)->get(['slug', $labelColumn])
                ->each(function ($row) use (&$paths, $prefix, $group, $labelColumn) {
                    $paths["$prefix/{$row->slug}"] = "$group · {$row->{$labelColumn}}";
                });
        };
        $add(Service::class, '/services', 'Service', 'name');
        $add(Project::class, '/work', 'Case study', 'name');
        $add(Post::class, '/blog', 'Blog post', 'title');

        return $paths;
    }

    /** "/about" → "About (/about)"; unknown paths are shown as typed. */
    public static function label(?string $path): string
    {
        if ($path === null || $path === '' || $path === '*') {
            return 'All pages';
        }
        $label = self::all()[$path] ?? null;

        return $label ? "$label ($path)" : $path;
    }
}
