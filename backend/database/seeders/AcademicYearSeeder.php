<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $start = Carbon::now()->month >= 7
            ? Carbon::create(Carbon::now()->year, 7, 1)
            : Carbon::create(Carbon::now()->year - 1, 7, 1);

        AcademicYear::query()->updateOrCreate(
            ['name' => sprintf('%d-%d', $start->year, $start->year + 1)],
            [
                'starts_on' => $start,
                'ends_on' => $start->copy()->addYear()->subDay(),
                'is_current' => true,
            ],
        );

        AcademicYear::query()
            ->where('name', '!=', sprintf('%d-%d', $start->year, $start->year + 1))
            ->update(['is_current' => false]);
    }
}
