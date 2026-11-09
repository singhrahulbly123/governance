<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\Program;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdministrationOverviewController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => [
                'administrators' => Role::query()
                    ->where('slug', 'administrator')
                    ->firstOrFail()
                    ->users()
                    ->count(),
                'super_administrators' => Role::query()
                    ->where('slug', 'super-administrator')
                    ->firstOrFail()
                    ->users()
                    ->count(),
                'total_users' => User::query()->count(),
                'departments' => Department::query()->count(),
                'programs' => Program::query()->count(),
                'academic_years' => AcademicYear::query()->count(),
            ],
        ]);
    }
}
