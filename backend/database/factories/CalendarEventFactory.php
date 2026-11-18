<?php

namespace Database\Factories;

use App\Models\CalendarEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CalendarEvent>
 */
class CalendarEventFactory extends Factory
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
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'event_type' => fake()->randomElement(['personal', 'class', 'meeting', 'deadline', 'other']),
            'starts_at' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'ends_at' => null,
            'is_all_day' => false,
            'location' => fake()->optional()->city(),
        ];
    }
}
