<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $startDate = $this->input('start_date');
        if (! $startDate && $this->route('project')) {
            $project = $this->route('project');
            $startDate = $project instanceof Project ? $project->start_date?->format('Y-m-d') : null;
        }

        $deadlineRule = ['nullable', 'date'];
        if ($startDate) {
            $deadlineRule[] = 'after_or_equal:'.$startDate;
        }

        return [
            'client_id' => ['sometimes', 'required', 'exists:clients,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:pending,active,completed'],
            'start_date' => ['nullable', 'date'],
            'deadline' => $deadlineRule,
        ];
    }
}
