<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MahasiswaRequest;
use App\Models\Mahasiswa;

class MahasiswaController extends Controller
{
    // Menyimpan data kartu RFID yang baru dipindai
    public function registerRFID(MahasiswaRequest $request)
    {
        $mahasiswa = Mahasiswa::create([
            'uid_kartu' => $request->uid_kartu,
        ]);

        return response()->json(['message' => 'Kartu berhasil terdaftar', 'mahasiswa' => $mahasiswa], 201);
    }

    // Mengupdate data mahasiswa setelah RFID terdaftar
    public function updateMahasiswa(MahasiswaRequest $request, $id)
    {
        $mahasiswa = Mahasiswa::findOrFail($id);

        // Update menggunakan data yang sudah divalidasi dari FormRequest
        $mahasiswa->update($request->validated());

        return response()->json(['message' => 'Data mahasiswa berhasil diperbarui', 'mahasiswa' => $mahasiswa], 200);
    }

    // Mendapatkan daftar semua mahasiswa
    public function getAllMahasiswa()
    {
        $mahasiswa = Mahasiswa::all();

        if ($mahasiswa->isEmpty()) {
            return response()->json(['message' => 'Tidak ada data mahasiswa'], 404);
        }

        return response()->json($mahasiswa);
    }

    // Mendapatkan detail mahasiswa berdasarkan UID kartu
    public function getMahasiswaByUID($uid_kartu)
    {
        $mahasiswa = Mahasiswa::query()->where('uid_kartu', $uid_kartu)->first();

        if (! $mahasiswa) {
            return response()->json(['message' => 'Mahasiswa tidak ditemukan'], 404);
        }

        return response()->json(['mahasiswa' => $mahasiswa]);
    }
}
