<?php

namespace App\Filament\Resources\CustomScriptResource\Pages;

use App\Filament\Resources\CustomScriptResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCustomScript extends CreateRecord
{
    protected static string $resource = CustomScriptResource::class;

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
