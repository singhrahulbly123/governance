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

        $demoRoleUsers = [
            [
                'name' => 'Dr. Ananya Rao',
                'email' => 'faculty@example.com',
                'department' => 'CSE · Computer Science & Engineering',
                'role' => 'faculty',
            ],
            [
                'name' => 'Prof. Kabir Mehta',
                'email' => 'visiting@example.com',
                'department' => 'DESIGN · School of Design',
                'role' => 'visiting',
            ],
            [
                'name' => 'Dr. Priya Nair',
                'email' => 'program@example.com',
                'department' => 'CSE · B.Tech CSE Program',
                'role' => 'program',
            ],
            [
                'name' => 'Dr. Rajesh Sharma',
                'email' => 'hod@example.com',
                'department' => 'CSE · Computer Science & Engineering',
                'role' => 'hod',
            ],
            [
                'name' => 'Dr. Sunita Deshmukh',
                'email' => 'dean@example.com',
                'department' => 'Academics · Office of the Dean',
                'role' => 'dean',
            ],
            [
                'name' => 'Dr. Arvind Krishnan',
                'email' => 'academic@example.com',
                'department' => 'IQAC · Academic Quality Cell',
                'role' => 'academic',
            ],
            [
                'name' => 'Mr. Vikramaditya Sen',
                'email' => 'management@example.com',
                'department' => 'Operations & Management',
                'role' => 'management',
            ],
            [
                'name' => 'Prof. N. Raghunathan',
                'email' => 'director@example.com',
                'department' => 'Office of the Director',
                'role' => 'director',
            ],
        ];

        foreach ($demoRoleUsers as $entry) {
            $role = Role::query()->where('slug', $entry['role'])->first();
            if (! $role) {
                continue;
            }

            $user = User::query()->updateOrCreate(
                ['email' => $entry['email']],
                [
                    'name' => $entry['name'],
                    'department' => $entry['department'],
                    'password' => Hash::make('RahulSingh123!'),
                    'is_active' => true,
                    'onboarded_at' => now(),
                    'email_verified_at' => now(),
                ],
            );

            $user->roles()->sync([$role->id]);
        }
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
                'is_active' => true,
                'onboarded_at' => now(),
                'email_verified_at' => now(),
            ],
        );

        $role = Role::query()->where('slug', $roleSlug)->firstOrFail();

        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
