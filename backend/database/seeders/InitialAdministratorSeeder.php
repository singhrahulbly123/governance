<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InitialAdministratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $administrator = config('app.initial_administrator');

        if (blank($administrator['name']) || blank($administrator['email']) || blank($administrator['password'])) {
            $this->command?->warn('Initial administrator was not seeded because INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, and INITIAL_ADMIN_PASSWORD are required.');

            return;
        }

        $user = User::query()->updateOrCreate(
            ['email' => $administrator['email']],
            [
                'name' => $administrator['name'],
                'password' => Hash::make($administrator['password']),
                'email_verified_at' => now(),
            ],
        );

        $role = Role::query()->where('slug', 'super-administrator')->firstOrFail();

        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
