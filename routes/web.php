<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/siswa', [\App\Http\Controllers\Web\SiswaWebController::class, 'index'])->name('siswa.index');
    Route::delete('/siswa/{id}', [\App\Http\Controllers\Web\SiswaWebController::class, 'destroy'])->name('siswa.destroy');
});

require __DIR__.'/settings.php';
