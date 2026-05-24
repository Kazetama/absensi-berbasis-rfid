<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\SiswaRequest;
use App\Models\Siswa;

class SiswaController extends Controller
{
    // Menyimpan data kartu RFID yang baru dipindai
    public function registerRFID(SiswaRequest $request)
    {

        // Menyimpan data siswa baru berdasarkan UID
        $siswa = Siswa::create([
            'uid_kartu' => $request->uid_kartu,
        ]);

        return response()->json(['message' => 'Kartu berhasil terdaftar', 'siswa' => $siswa], 201);
    }

    // Mengupdate data siswa setelah RFID terdaftar
    public function updateSiswa(SiswaRequest $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        // Update menggunakan data yang sudah divalidasi dari FormRequest
        $siswa->update($request->validated());

        return response()->json(['message' => 'Data siswa berhasil diperbarui', 'siswa' => $siswa], 200);
    }

    // Mendapatkan daftar semua siswa
    public function getAllSiswa()
    {
        $siswa = Siswa::all();

        if ($siswa->isEmpty()) {
            return response()->json(['message' => 'Tidak ada data siswa'], 404);
        }

        return response()->json($siswa);
    }

    // Mendapatkan detail siswa berdasarkan UID kartu
    public function getSiswaByUID($uid_kartu)
    {
        $siswa = Siswa::query()->where('uid_kartu', $uid_kartu)->first();

        if (! $siswa) {
            return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
        }

        return response()->json(['siswa' => $siswa]);
    }
}
