<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettingAbsensi extends Model
{
    protected $fillable = [
        'jam_masuk_mulai',
        'jam_masuk_batas',
        'jam_masuk_selesai',
        'jam_pulang_mulai',
        'jam_pulang_selesai',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
