<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->foreignId('post_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('team_members')->nullOnDelete();
            $table->date('published_at')->nullable();
            $table->unsignedSmallInteger('read_time')->default(5);
            $table->json('cover')->nullable();
            $table->text('excerpt')->nullable();
            $table->text('description')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('featured')->default(false);
            // Article blocks: p, h2, list, quote, stats, steps, image, callout.
            $table->json('body')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('og_image')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
