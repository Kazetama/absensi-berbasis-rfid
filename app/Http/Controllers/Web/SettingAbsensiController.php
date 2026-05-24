<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SettingAbsensi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingAbsensiController extends Controller
{
    public function index()
    {
        $setting = SettingAbsensi::query()->first();
        if (! $setting) {
            $setting = SettingAbsensi::create([
                'jam_masuk_mulai' => '06:00:00',
                'jam_masuk_batas' => '07:30:00',
                'jam_masuk_selesai' => '08:30:00',
                'jam_pulang_mulai' => '16:00:00',
                'jam_pulang_selesai' => '18:00:00',
                'is_active' => true,
            ]);
        }

        // Format times to H:i for display in <input type="time">
        $setting->jam_masuk_mulai = substr($setting->jam_masuk_mulai, 0, 5);
        $setting->jam_masuk_batas = substr($setting->jam_masuk_batas, 0, 5);
        $setting->jam_masuk_selesai = substr($setting->jam_masuk_selesai, 0, 5);
        $setting->jam_pulang_mulai = substr($setting->jam_pulang_mulai, 0, 5);
        $setting->jam_pulang_selesai = substr($setting->jam_pulang_selesai, 0, 5);

        return Inertia::render('absensi/setting', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'jam_masuk_mulai' => 'required|date_format:H:i',
            'jam_masuk_batas' => 'required|date_format:H:i',
            'jam_masuk_selesai' => 'required|date_format:H:i',
            'jam_pulang_mulai' => 'required|date_format:H:i',
            'jam_pulang_selesai' => 'required|date_format:H:i',
            'is_active' => 'required|boolean',
        ]);

        $setting = SettingAbsensi::query()->first();
        if (! $setting) {
            $setting = new SettingAbsensi;
        }

        $setting->fill([
            'jam_masuk_mulai' => $request->jam_masuk_mulai.':00',
            'jam_masuk_batas' => $request->jam_masuk_batas.':00',
            'jam_masuk_selesai' => $request->jam_masuk_selesai.':00',
            'jam_pulang_mulai' => $request->jam_pulang_mulai.':00',
            'jam_pulang_selesai' => $request->jam_pulang_selesai.':00',
            'is_active' => $request->is_active,
        ]);

        $setting->save();

        return redirect()->back()->with('success', 'Pengaturan absensi berhasil diperbarui.');
    }
}
