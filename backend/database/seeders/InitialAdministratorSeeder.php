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
        $this->seedAdministrator(
            config('app.initial_super_administrator'),
            'super-administrator',
            'INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, and INITIAL_ADMIN_PASSWORD',
        );

        $this->seedAdministrator(
            config('app.initial_administrator'),
            'administrator',
            'INITIAL_STANDARD_ADMIN_NAME, INITIAL_STANDARD_ADMIN_EMAIL, and INITIAL_STANDARD_ADMIN_PASSWORD',
        );
    }

    /**
     * @param  array{name: ?string, email: ?string, password: ?string}  $administrator
     */
    private function seedAdministrator(array $administrator, string $roleSlug, string $requiredSettings): void
    {

        if (blank($administrator['name']) || blank($administrator['email']) || blank($administrator['password'])) {
            $this->command?->warn("{$roleSlug} was not seeded because {$requiredSettings} are required.");

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

        $role = Role::query()->where('slug', $roleSlug)->firstOrFail();

        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
