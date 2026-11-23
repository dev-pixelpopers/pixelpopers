<?php

namespace App\Filament\Resources\CustomScriptResource\Pages;

use App\Filament\Resources\CustomScriptResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCustomScript extends EditRecord
{
    protected static string $resource = CustomScriptResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }
}
