import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Settings, ShieldAlert, Clock, Power } from 'lucide-react';

interface SettingData {
    id: number;
    jam_masuk_mulai: string;
    jam_masuk_batas: string;
    jam_masuk_selesai: string;
    jam_pulang_mulai: string;
    jam_pulang_selesai: string;
    is_active: boolean;
}

interface Props {
    setting: SettingData;
}

export default function AbsensiSetting({ setting }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        jam_masuk_mulai: setting.jam_masuk_mulai,
        jam_masuk_batas: setting.jam_masuk_batas,
        jam_masuk_selesai: setting.jam_masuk_selesai,
        jam_pulang_mulai: setting.jam_pulang_mulai,
        jam_pulang_selesai: setting.jam_pulang_selesai,
        is_active: setting.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put('/absensi/setting', {
            onSuccess: () => {
                toast.success('Pengaturan absensi berhasil diperbarui.');
            },
            onError: () => {
                toast.error('Gagal memperbarui pengaturan. Periksa kembali inputan Anda.');
            }
        });
    };

    return (
        <>
            <Head title="Pengaturan Absensi" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Pengaturan Absensi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Atur aturan rentang jam masuk, jam pulang, toleransi keterlambatan, dan status buka-tutup sistem absensi.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card Status Aktif/Tutup */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm overflow-hidden">
                        <div className={`h-1.5 w-full ${data.is_active ? 'bg-green-500' : 'bg-rose-500'}`} />
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Power className="h-5 w-5 text-muted-foreground" />
                                        Status Mesin Absensi
                                    </CardTitle>
                                    <CardDescription>
                                        Buka atau tutup sistem absensi RFID. Jika ditutup, semua tap kartu akan ditolak otomatis.
                                    </CardDescription>
                                </div>
                                
                                {/* Custom Toggle Switch */}
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`${
                                        data.is_active ? 'bg-green-600' : 'bg-rose-600'
                                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`${
                                            data.is_active ? 'translate-x-5' : 'translate-x-0'
                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out`}
                                    />
                                </button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Rentang Absen Masuk */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Rentang Absen Masuk
                            </CardTitle>
                            <CardDescription>
                                Tentukan batas jam bagi siswa untuk menge-tap masuk di pagi hari.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="jam_masuk_mulai">Jam Buka Absen</Label>
                                    <Input
                                        id="jam_masuk_mulai"
                                        type="time"
                                        value={data.jam_masuk_mulai}
                                        onChange={(e) => setData('jam_masuk_mulai', e.target.value)}
                                    />
                                    <span className="text-[11px] text-muted-foreground block">
                                        Waktu paling awal siswa dapat mulai tap masuk.
                                    </span>
                                    {errors.jam_masuk_mulai && (
                                        <p className="text-xs text-rose-500 font-semibold">{errors.jam_masuk_mulai}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_masuk_batas">Jam Mulai Terlambat</Label>
                                    <Input
                                        id="jam_masuk_batas"
                                        type="time"
                                        value={data.jam_masuk_batas}
                                        onChange={(e) => setData('jam_masuk_batas', e.target.value)}
                                    />
                                    <span className="text-[11px] text-muted-foreground block">
                                        Waktu toleransi normal. Lewat jam ini berstatus Terlambat.
                                    </span>
                                    {errors.jam_masuk_batas && (
                                        <p className="text-xs text-rose-500 font-semibold">{errors.jam_masuk_batas}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_masuk_selesai">Batas Maksimal Masuk</Label>
                                    <Input
                                        id="jam_masuk_selesai"
                                        type="time"
                                        value={data.jam_masuk_selesai}
                                        onChange={(e) => setData('jam_masuk_selesai', e.target.value)}
                                    />
                                    <span className="text-[11px] text-muted-foreground block">
                                        Waktu paling akhir tap masuk diizinkan oleh alat.
                                    </span>
                                    {errors.jam_masuk_selesai && (
                                        <p className="text-xs text-rose-500 font-semibold">{errors.jam_masuk_selesai}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rentang Absen Pulang */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Rentang Absen Pulang
                            </CardTitle>
                            <CardDescription>
                                Tentukan batas jam bagi siswa untuk menge-tap pulang di sore hari.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="jam_pulang_mulai">Jam Buka Absen Pulang</Label>
                                    <Input
                                        id="jam_pulang_mulai"
                                        type="time"
                                        value={data.jam_pulang_mulai}
                                        onChange={(e) => setData('jam_pulang_mulai', e.target.value)}
                                    />
                                    <span className="text-[11px] text-muted-foreground block">
                                        Siswa tidak boleh tap pulang sebelum waktu ini tiba.
                                    </span>
                                    {errors.jam_pulang_mulai && (
                                        <p className="text-xs text-rose-500 font-semibold">{errors.jam_pulang_mulai}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_pulang_selesai">Batas Maksimal Pulang</Label>
                                    <Input
                                        id="jam_pulang_selesai"
                                        type="time"
                                        value={data.jam_pulang_selesai}
                                        onChange={(e) => setData('jam_pulang_selesai', e.target.value)}
                                    />
                                    <span className="text-[11px] text-muted-foreground block">
                                        Waktu paling akhir tap pulang diizinkan oleh alat.
                                    </span>
                                    {errors.jam_pulang_selesai && (
                                        <p className="text-xs text-rose-500 font-semibold">{errors.jam_pulang_selesai}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tombol Simpan */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-6"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AbsensiSetting.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Absen',
            href: '/absensi/setting',
        },
    ],
};
