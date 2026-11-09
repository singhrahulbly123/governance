<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = Carbon::create(fake()->numberBetween(2020, 2030), 7, 1);

        return [
            'name' => sprintf('%d-%d', $start->year, $start->year + 1),
            'starts_on' => $start,
            'ends_on' => $start->copy()->addYear()->subDay(),
            'is_current' => false,
        ];
    }
}
