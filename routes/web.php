<?php

use App\Http\Controllers\Web\AbsensiWebController;
use App\Http\Controllers\Web\SettingAbsensiController;
use App\Http\Controllers\Web\SiswaWebController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/siswa', [SiswaWebController::class, 'index'])->name('siswa.index');
    Route::delete('/siswa/{id}', [SiswaWebController::class, 'destroy'])->name('siswa.destroy');

    Route::get('/absensi/rekap', [AbsensiWebController::class, 'rekap'])->name('absensi.rekap');
    Route::get('/absensi/rekap/{kelas}', [AbsensiWebController::class, 'rekapDetail'])->name('absensi.rekap-detail');

    Route::get('/absensi/setting', [SettingAbsensiController::class, 'index'])->name('absensi.setting');
    Route::put('/absensi/setting', [SettingAbsensiController::class, 'update'])->name('absensi.setting-update');
});

require __DIR__.'/settings.php';
