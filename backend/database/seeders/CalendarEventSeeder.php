<?php

namespace Database\Seeders;

use App\Models\CalendarEvent;
use App\Models\User;
use Illuminate\Database\Seeder;

class CalendarEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        $user = User::query()->first();
        if ($user !== null) {
            CalendarEvent::factory()->count(5)->for($user)->create();
        }
    }
}
