<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->form }}

        <div class="mt-6 flex flex-wrap gap-3">
            <x-filament::button type="submit">
                Save navigation
            </x-filament::button>

            <x-filament::button type="button" color="gray" outlined wire:click="resetMenus" wire:confirm="Put both menus back to the site’s original links?">
                Reset to the original links
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
