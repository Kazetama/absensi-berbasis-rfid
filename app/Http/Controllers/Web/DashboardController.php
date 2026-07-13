<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Mahasiswa;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $totalMahasiswa = Mahasiswa::count();
        $hadirHariIni = Absensi::whereDate('tanggal', today())->where('status', 'Hadir')->count();
        $terlambatHariIni = Absensi::whereDate('tanggal', today())->where('status', 'Terlambat')->count();
        $tidakHadirHariIni = max(0, $totalMahasiswa - ($hadirHariIni + $terlambatHariIni));

        $lastSeen = Cache::get('rfid_device_last_seen');
        $deviceStatus = 'Offline';
        $lastSeenHuman = null;

        // Safely parse $lastSeen to avoid incomplete class issues
        if ($lastSeen) {
            if (is_string($lastSeen)) {
                try {
                    $lastSeen = Carbon::parse($lastSeen);
                } catch (\Exception $e) {
                    $lastSeen = null;
                }
            } elseif (! ($lastSeen instanceof \DateTimeInterface)) {
                $lastSeen = null;
            }
        }

        if ($lastSeen) {
            $diffInSeconds = now()->diffInSeconds($lastSeen);
            if ($diffInSeconds < 300) { // Kurang dari 5 menit dianggap Online
                $deviceStatus = 'Online';
            } else {
                $deviceStatus = 'Standby';
            }
            $lastSeenHuman = $lastSeen->locale('id')->diffForHumans();
        }

        // Data Grafik Kehadiran 7 Hari Terakhir
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateString = $date->toDateString();
            $label = $date->locale('id')->translatedFormat('D, d M');

            $hadir = Absensi::whereDate('tanggal', $dateString)->where('status', 'Hadir')->count();
            $terlambat = Absensi::whereDate('tanggal', $dateString)->where('status', 'Terlambat')->count();
            $tidakHadir = max(0, $totalMahasiswa - ($hadir + $terlambat));

            $chartData[] = [
                'date' => $dateString,
                'label' => $label,
                'hadir' => $hadir,
                'terlambat' => $terlambat,
                'tidak_hadir' => $tidakHadir,
            ];
        }

        // Aktivitas Terbaru (5 log scan absensi terbaru)
        $recentActivities = Absensi::with('siswa')
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(function ($absen) {
                $isPulang = ! empty($absen->jam_pulang);

                return [
                    'id' => $absen->id,
                    'nama' => $absen->siswa->nama ?? 'Kartu Baru ('.$absen->siswa->uid_kartu.')',
                    'nim' => $absen->siswa->nim ?? '-',
                    'kelas' => $absen->siswa->kelas ?? '-',
                    'gambar' => $absen->siswa->gambar,
                    'tipe' => $isPulang ? 'Pulang' : 'Masuk',
                    'waktu' => substr($isPulang ? $absen->jam_pulang : $absen->jam_masuk, 0, 5),
                    'status' => $absen->status,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'total_siswa' => $totalMahasiswa, // Keep key 'total_siswa' for compatibility with dashboard.tsx props
                'hadir' => $hadirHariIni,
                'terlambat' => $terlambatHariIni,
                'tidak_hadir' => $tidakHadirHariIni,
                'device_status' => $deviceStatus,
                'device_last_seen' => $lastSeenHuman,
            ],
            'chartData' => $chartData,
            'recentActivities' => $recentActivities,
        ]);
    }
}
