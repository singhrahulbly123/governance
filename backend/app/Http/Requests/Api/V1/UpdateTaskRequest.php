<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:180'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'due_at' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', 'required', 'string', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
            'priority' => ['sometimes', 'required', 'string', Rule::in(['low', 'normal', 'high'])],
        ];
    }
}
