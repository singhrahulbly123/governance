<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(5),
            'description' => fake()->optional()->paragraph(),
            'due_at' => fake()->optional()->dateTimeBetween('+1 day', '+30 days'),
            'status' => 'pending',
            'priority' => fake()->randomElement(['low', 'normal', 'high']),
            'completed_at' => null,
        ];
    }
}
