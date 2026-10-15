<?php

namespace App\Filament\Resources\ShowreelItemResource\Pages;

use App\Filament\Resources\ShowreelItemResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListShowreelItems extends ListRecords
{
    protected static string $resource = ShowreelItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
