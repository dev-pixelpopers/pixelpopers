<?php

namespace App\Filament\Resources\PostResource\RelationManagers;

use App\Filament\Resources\CommentResource;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

/** The post's comments, moderated the same way as on the Comments page. */
class CommentsRelationManager extends RelationManager
{
    protected static string $relationship = 'comments';

    public function form(Schema $schema): Schema
    {
        return CommentResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return CommentResource::table($table, withPost: false);
    }
}
