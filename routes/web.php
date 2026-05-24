<?php

use App\Http\Controllers\Web\SiswaWebController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/siswa', [SiswaWebController::class, 'index'])->name('siswa.index');
    Route::delete('/siswa/{id}', [SiswaWebController::class, 'destroy'])->name('siswa.destroy');
});

require __DIR__.'/settings.php';
