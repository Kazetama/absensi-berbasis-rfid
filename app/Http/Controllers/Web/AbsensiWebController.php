<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiWebController extends Controller
{
    public function rekap()
    {
        $classes = Siswa::query()
            ->select('kelas')
            ->whereNotNull('kelas')
            ->groupBy('kelas')
            ->get()
            ->map(function ($siswa) {
                $kelas = $siswa->kelas;
                $totalSiswa = Siswa::where('kelas', $kelas)->count();
                $totalAbsen = Absensi::whereHas('siswa', function ($q) use ($kelas) {
                    $q->where('kelas', $kelas);
                })->count();
                $hadirHariIni = Absensi::whereHas('siswa', function ($q) use ($kelas) {
                    $q->where('kelas', $kelas);
                })->whereDate('tanggal', now()->toDateString())->count();

                return [
                    'kelas' => $kelas,
                    'total_siswa' => $totalSiswa,
                    'total_absen' => $totalAbsen,
                    'hadir_hari_ini' => $hadirHariIni,
                ];
            });

        return Inertia::render('absensi/rekap', [
            'classes' => $classes,
        ]);
    }

    public function rekapDetail(Request $request, $kelas)
    {
        $search = $request->input('search');
        $date = $request->input('date');

        $absensi = Absensi::with('siswa')
            ->whereHas('siswa', function ($q) use ($kelas, $search) {
                $q->where('kelas', $kelas)
                    ->when($search, function ($query, $search) {
                        $query->where('nama', 'like', "%{$search}%")
                            ->orWhere('nis', 'like', "%{$search}%");
                    });
            })
            ->when($date, function ($query, $date) {
                $query->whereDate('tanggal', $date);
            })
            ->orderBy('tanggal', 'desc')
            ->orderBy('jam_masuk', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('absensi/rekap-detail', [
            'kelas' => $kelas,
            'absensi' => $absensi,
            'filters' => [
                'search' => $search ?? '',
                'date' => $date ?? '',
            ],
        ]);
    }
}
