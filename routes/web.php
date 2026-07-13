<?php

use App\Http\Controllers\Web\AbsensiWebController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\MahasiswaWebController;
use App\Http\Controllers\Web\SettingAbsensiController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/mahasiswa', [MahasiswaWebController::class, 'index'])->name('mahasiswa.index');
    Route::post('/mahasiswa/{id}', [MahasiswaWebController::class, 'update'])->name('mahasiswa.update');
    Route::delete('/mahasiswa/{id}', [MahasiswaWebController::class, 'destroy'])->name('mahasiswa.destroy');

    Route::get('/absensi/rekap', [AbsensiWebController::class, 'rekap'])->name('absensi.rekap');
    Route::get('/absensi/rekap/{kelas}', [AbsensiWebController::class, 'rekapDetail'])->name('absensi.rekap-detail');

    Route::get('/absensi/setting', [SettingAbsensiController::class, 'index'])->name('absensi.setting');
    Route::put('/absensi/setting', [SettingAbsensiController::class, 'update'])->name('absensi.setting-update');
});

require __DIR__.'/settings.php';
