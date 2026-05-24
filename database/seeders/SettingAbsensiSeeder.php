<?php

namespace Database\Seeders;

use App\Models\SettingAbsensi;
use Illuminate\Database\Seeder;

class SettingAbsensiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SettingAbsensi::updateOrCreate(
            ['id' => 1],
            [
                'jam_masuk_mulai' => '06:00:00',
                'jam_masuk_batas' => '07:30:00',
                'jam_masuk_selesai' => '08:30:00',
                'jam_pulang_mulai' => '16:00:00',
                'jam_pulang_selesai' => '18:00:00',
                'is_active' => true,
            ]
        );
    }
}
