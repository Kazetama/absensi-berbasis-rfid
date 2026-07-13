<?php

use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\MahasiswaController;
use Illuminate\Support\Facades\Route;

// API untuk mahasiswa
Route::post('/register-rfid', [MahasiswaController::class, 'registerRFID']);
Route::put('/update-mahasiswa/{id}', [MahasiswaController::class, 'updateMahasiswa']);
Route::get('/mahasiswa', [MahasiswaController::class, 'getAllMahasiswa']);
Route::get('/mahasiswa/{uid_kartu}', [MahasiswaController::class, 'getMahasiswaByUID']);

// API untuk absensi
Route::post('/absen', [AbsensiController::class, 'absen']);
Route::get('/absensi', [AbsensiController::class, 'getAllAbsensi']);
Route::get('/absensi/{uid_kartu}', [AbsensiController::class, 'getAbsensiByUID']);

// test api
Route::get('test', function () {
    return response()->json(['message' => 'keren nih bisa!']);
});
