<?php

namespace App\Filament\Resources\CustomScriptResource\Pages;

use App\Filament\Resources\CustomScriptResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCustomScripts extends ListRecords
{
    protected static string $resource = CustomScriptResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('New script'),
        ];
    }
}
