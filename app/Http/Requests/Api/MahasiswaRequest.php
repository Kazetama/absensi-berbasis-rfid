<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class MahasiswaRequest extends FormRequest
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
     */
    public function rules(): array
    {
        // Jika request-nya POST (untuk register RFID)
        if ($this->isMethod('post')) {
            return [
                'uid_kartu' => 'required|unique:mahasiswas,uid_kartu',
            ];
        }

        // Jika request-nya PUT / PATCH (untuk update data siswa)
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return [
                'nama' => 'nullable|string',
                'nim' => [
                    'nullable',
                    'string',
                    'regex:/^[A-Za-z]\d{2}\.\d{4}\.\d{5}$/',
                ],
                'gambar' => 'nullable|string',
                'nomor_orangtua' => 'nullable|string',
                'alamat' => 'nullable|string',
                'kelas' => 'nullable|string',
            ];
        }

        return [];
    }

    /**
     * Get the validation messages.
     */
    public function messages(): array
    {
        return [
            'nim.regex' => 'Format NIM harus sesuai ketentuan (contoh: F11.2023.00076).',
        ];
    }
}
