import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Settings, Clock, Power, Save } from 'lucide-react';

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

            <div className="flex h-full flex-1 flex-col gap-8 p-6 max-w-4xl mx-auto">
                {/* Header Page */}
                <div className="flex flex-col gap-1.5 border-b pb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
                        <Settings className="h-7 w-7 text-primary" />
                        Pengaturan Absensi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola aturan jam masuk, jam pulang, toleransi keterlambatan, dan status operasional sistem.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Card Status Operasional */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between p-6">
                            <div className="space-y-1.5 pr-4">
                                <CardTitle className="flex items-center gap-2.5">
                                    <Power className="h-5 w-5 text-muted-foreground" />
                                    Status Mesin Absensi
                                    {/* Indikator Titik Status */}
                                    <span className="relative flex h-3 w-3 ml-2">
                                        {data.is_active && (
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        )}
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${data.is_active ? 'bg-green-500' : 'bg-rose-500'}`}></span>
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    Buka atau tutup akses sistem absensi RFID. Jika dimatikan, semua tap kartu akan ditolak secara otomatis.
                                </CardDescription>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button
                                type="button"
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`${
                                    data.is_active ? 'bg-green-500' : 'bg-rose-500'
                                } relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${
                                        data.is_active ? 'translate-x-7' : 'translate-x-0'
                                    } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
                                />
                            </button>
                        </CardHeader>
                    </Card>

                    {/* Card Rentang Absen Masuk */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm overflow-hidden">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Konfigurasi Absen Masuk
                            </CardTitle>
                            <CardDescription>
                                Tentukan batas waktu operasional pemindaian kartu di pagi hari.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid gap-6 sm:grid-cols-3">
                                <div className="space-y-2.5">
                                    <Label htmlFor="jam_masuk_mulai">Jam Buka Absen</Label>
                                    <Input
                                        id="jam_masuk_mulai"
                                        type="time"
                                        value={data.jam_masuk_mulai}
                                        onChange={(e) => setData('jam_masuk_mulai', e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-[12px] text-muted-foreground leading-tight">
                                        Waktu paling awal mesin menerima tap masuk.
                                    </p>
                                    {errors.jam_masuk_mulai && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.jam_masuk_mulai}</p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="jam_masuk_batas">Batas Normal (Terlambat)</Label>
                                    <Input
                                        id="jam_masuk_batas"
                                        type="time"
                                        value={data.jam_masuk_batas}
                                        onChange={(e) => setData('jam_masuk_batas', e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-[12px] text-muted-foreground leading-tight">
                                        Tap setelah jam ini akan dicatat sebagai Terlambat.
                                    </p>
                                    {errors.jam_masuk_batas && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.jam_masuk_batas}</p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="jam_masuk_selesai">Jam Tutup Absen</Label>
                                    <Input
                                        id="jam_masuk_selesai"
                                        type="time"
                                        value={data.jam_masuk_selesai}
                                        onChange={(e) => setData('jam_masuk_selesai', e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-[12px] text-muted-foreground leading-tight">
                                        Waktu paling akhir tap masuk diizinkan mesin.
                                    </p>
                                    {errors.jam_masuk_selesai && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.jam_masuk_selesai}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card Rentang Absen Pulang */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm overflow-hidden">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Konfigurasi Absen Pulang
                            </CardTitle>
                            <CardDescription>
                                Tentukan batas waktu operasional pemindaian kartu di sore hari.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2.5">
                                    <Label htmlFor="jam_pulang_mulai">Jam Mulai Pulang</Label>
                                    <Input
                                        id="jam_pulang_mulai"
                                        type="time"
                                        value={data.jam_pulang_mulai}
                                        onChange={(e) => setData('jam_pulang_mulai', e.target.value)}
                                        className="w-full sm:max-w-[240px]"
                                    />
                                    <p className="text-[12px] text-muted-foreground leading-tight">
                                        Siswa tidak diizinkan tap pulang sebelum waktu ini.
                                    </p>
                                    {errors.jam_pulang_mulai && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.jam_pulang_mulai}</p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="jam_pulang_selesai">Jam Tutup Mesin</Label>
                                    <Input
                                        id="jam_pulang_selesai"
                                        type="time"
                                        value={data.jam_pulang_selesai}
                                        onChange={(e) => setData('jam_pulang_selesai', e.target.value)}
                                        className="w-full sm:max-w-[240px]"
                                    />
                                    <p className="text-[12px] text-muted-foreground leading-tight">
                                        Waktu paling akhir tap pulang diizinkan mesin.
                                    </p>
                                    {errors.jam_pulang_selesai && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.jam_pulang_selesai}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Area */}
                    <div className="flex items-center justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-8 flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan Data...' : 'Simpan Pengaturan'}
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