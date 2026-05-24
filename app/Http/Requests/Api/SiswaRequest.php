<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SiswaRequest extends FormRequest
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
                'uid_kartu' => 'required|unique:siswas,uid_kartu',
            ];
        }

        // Jika request-nya PUT / PATCH (untuk update data siswa)
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return [
                'nama' => 'nullable|string',
                'gambar' => 'nullable|string',
                'nomor_orangtua' => 'nullable|string',
                'alamat' => 'nullable|string',
                'kelas' => 'nullable|string',
            ];
        }

        return [];
    }
}
