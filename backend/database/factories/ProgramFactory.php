<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'code' => fake()->unique()->bothify('PRG-###'),
            'name' => fake()->unique()->words(3, true),
            'level' => fake()->randomElement(['Undergraduate', 'Postgraduate']),
            'duration_years' => fake()->numberBetween(1, 4),
            'is_active' => true,
        ];
    }
}
