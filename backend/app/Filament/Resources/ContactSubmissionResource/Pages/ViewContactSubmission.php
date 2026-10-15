<?php

namespace App\Filament\Resources\ContactSubmissionResource\Pages;

use App\Filament\Resources\ContactSubmissionResource;
use App\Models\ContactSubmission;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Pages\ViewRecord;

class ViewContactSubmission extends ViewRecord
{
    protected static string $resource = ContactSubmissionResource::class;

    public function mount(int|string $record): void
    {
        parent::mount($record);

        // Opening an enquiry counts as having seen it.
        if ($this->record->status === 'new') {
            $this->record->update(['status' => 'read']);
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('reply')->icon('heroicon-o-envelope')
                ->url(fn () => 'mailto:'.$this->record->email.'?subject='.rawurlencode('Re: your project with Pixel Popers')),
            Actions\Action::make('status')->label('Change status')->icon('heroicon-o-flag')->color('gray')
                ->schema([Forms\Components\Select::make('status')->options(ContactSubmission::STATUSES)->required()->native(false)])
                ->fillForm(fn () => ['status' => $this->record->status])
                ->action(fn (array $data) => $this->record->update($data)),
            Actions\DeleteAction::make(),
        ];
    }
}
