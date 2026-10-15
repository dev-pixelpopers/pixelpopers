<?php

namespace App\Filament\Resources\ShowreelItemResource\Pages;

use App\Filament\Resources\ShowreelItemResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditShowreelItem extends EditRecord
{
    protected static string $resource = ShowreelItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
