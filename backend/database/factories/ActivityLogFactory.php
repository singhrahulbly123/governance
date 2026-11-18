<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
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
            'event' => 'task.created',
            'description' => 'Created task: '.fake()->sentence(4),
            'subject_type' => 'task',
            'subject_id' => fake()->randomNumber(4),
            'metadata' => ['status' => 'pending', 'priority' => 'normal'],
        ];
    }
}
