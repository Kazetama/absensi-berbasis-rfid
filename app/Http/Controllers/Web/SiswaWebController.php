<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
            'kelasList' => $kelasList,
        ]);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'nama' => 'nullable|string|max:255',
            'nis' => 'nullable|string|max:50',
            'kelas' => 'nullable|string|max:50',
            'nomor_orangtua' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'gambar' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $siswa->nama = $request->input('nama');
        $siswa->nis = $request->input('nis');
        $siswa->kelas = $request->input('kelas');
        $siswa->nomor_orangtua = $request->input('nomor_orangtua');
        $siswa->alamat = $request->input('alamat');

        if ($request->hasFile('gambar')) {
            if ($siswa->gambar && Storage::disk('public')->exists($siswa->gambar)) {
                Storage::disk('public')->delete($siswa->gambar);
            }
            $path = $request->file('gambar')->store('siswa', 'public');
            $siswa->gambar = $path;
        }

        $siswa->save();

        return back();
    }

    public function destroy($id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->delete();

        // Mengembalikan response tanpa me-reload halaman berkat Inertia
        return back();
    }
}
