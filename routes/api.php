<?php

use Illuminate\Support\Facades\Route;

// test api
Route::get('test', function () {
    return response()->json(['message' => 'keren nih bisa!']);
});