<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SiswaController;

// API untuk siswa
Route::post('/register-rfid', [SiswaController::class, 'registerRFID']);
Route::put('/update-siswa/{id}', [SiswaController::class, 'updateSiswa']);
Route::get('/siswa', [SiswaController::class, 'getAllSiswa']);
Route::get('/siswa/{uid_kartu}', [SiswaController::class, 'getSiswaByUID']);

// test api
Route::get('test', function () {
    return response()->json(['message' => 'keren nih bisa!']);
});
