<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SiswaWebController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kelas = $request->input('kelas');

        $siswas = Siswa::query()
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('uid_kartu', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($kelas, function ($query, $kelas) {
                return $query->where('kelas', $kelas);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        
        // Ambil daftar kelas unik untuk dropdown filter
        $kelasList = Siswa::query()
            ->where('kelas', '!=', null)
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas', 'asc')
            ->pluck('kelas');

        return Inertia::render('siswa/index', [
            'siswas' => $siswas,
            'filters' => [
                'search' => $search ?? '',
                'kelas' => $kelas ?? '',
            ],
            'kelasList' => $kelasList
        ]);
    }

    public function destroy($id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->delete();

        // Mengembalikan response tanpa me-reload halaman berkat Inertia
        return back();
    }
}
