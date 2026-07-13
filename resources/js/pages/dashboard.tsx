import { Head } from '@inertiajs/react';
import {
    Users,
    CheckCircle2,
    Clock,
    Cpu,
    Calendar as CalendarIcon,
    ArrowUpRight,
    Activity,
    AlertCircle,
    Clock3
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboard } from '@/routes';

interface Props {
    stats: {
        total_siswa: number;
        hadir: number;
        terlambat: number;
        tidak_hadir: number;
        device_status: 'Online' | 'Offline' | 'Standby';
        device_last_seen: string | null;
    };
    chartData: {
        date: string;
        label: string;
        hadir: number;
        terlambat: number;
        tidak_hadir: number;
    }[];
    recentActivities: {
        id: number;
        nama: string;
        nim: string;
        kelas: string;
        gambar: string | null;
        tipe: 'Masuk' | 'Pulang';
        waktu: string;
        status: string;
    }[];
}

export default function Dashboard({ stats, chartData, recentActivities }: Props) {
    // State untuk Jam Digital Real-Time
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Pembuatan Kalender Custom Sederhana
    const dateObj = new Date();
    const currentYear = dateObj.getFullYear();
    const currentMonth = dateObj.getMonth();
    const todayDate = dateObj.getDate();

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Dapatkan hari pertama dari bulan ini
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Dapatkan jumlah hari di bulan ini
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Sesuaikan indeks agar Senin jadi hari pertama (0 = Sen, 6 = Min)
    const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const calendarCells = [];
    // Isi cell kosong sebelum hari pertama
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(null);
    }
    // Isi cell tanggal
    for (let d = 1; d <= totalDays; d++) {
        calendarCells.push(d);
    }

    // Hitung rata-rata kehadiran untuk di grafik
    const maxAttendance = stats.total_siswa > 0 ? stats.total_siswa : 1;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                
                {/* Header Welcome & Jam Digital */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang di E-Absensi</h1>
                        <p className="text-sm text-muted-foreground">Monitor absensi mahasiswa berbasis kartu RFID secara real-time.</p>
                    </div>
                    {/* Live Clock Widget */}
                    <div className="flex items-center gap-3 rounded-lg border border-sidebar-border/70 bg-card p-3 px-4 shadow-sm dark:border-sidebar-border">
                        <Clock3 className="h-5 w-5 text-primary animate-pulse" />
                        <div className="text-right">
                            <div className="font-mono text-lg font-bold leading-none">
                                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Kartu Statistik Utama */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Siswa */}
                    <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Mahasiswa</CardTitle>
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total_siswa}</div>
                            <p className="text-xs text-muted-foreground mt-1">Mahasiswa terdaftar aktif</p>
                        </CardContent>
                    </Card>

                    {/* Hadir */}
                    <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Hadir Hari Ini</CardTitle>
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-500">{stats.hadir}</div>
                            <p className="text-xs text-muted-foreground mt-1">Absensi masuk tepat waktu</p>
                        </CardContent>
                    </Card>

                    {/* Terlambat */}
                    <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Terlambat Hari Ini</CardTitle>
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-500">{stats.terlambat}</div>
                            <p className="text-xs text-muted-foreground mt-1">Datang setelah jam masuk batas</p>
                        </CardContent>
                    </Card>

                    {/* Status Alat (Wemos) */}
                    <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-300" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Status Scanner RFID</CardTitle>
                            <div className={`p-2 rounded-lg ${
                                stats.device_status === 'Online' ? 'bg-green-500/10 text-green-500' :
                                stats.device_status === 'Standby' ? 'bg-amber-500/10 text-amber-500' : 'bg-destructive/10 text-destructive'
                            }`}>
                                <Cpu className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <span className={`h-3 w-3 rounded-full ${
                                    stats.device_status === 'Online' ? 'bg-green-500 animate-pulse' :
                                    stats.device_status === 'Standby' ? 'bg-amber-500 animate-pulse' : 'bg-destructive'
                                }`} />
                                <div className="text-2xl font-bold">
                                    {stats.device_status === 'Online' ? 'Terhubung' :
                                     stats.device_status === 'Standby' ? 'Standby' : 'Terputus'}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {stats.device_last_seen ? `Aktif ${stats.device_last_seen}` : 'Alat belum pernah aktif'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bagian Grafik & Kalender */}
                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* Grafik Absensi Harian (Kiri) */}
                    <Card className="md:col-span-2 border-sidebar-border/70 shadow-sm dark:border-sidebar-border flex flex-col justify-between">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-base font-semibold">Grafik Absensi Harian</CardTitle>
                                    <CardDescription>Tren kehadiran mahasiswa dalam 7 hari terakhir.</CardDescription>
                                </div>
                                <div className="flex gap-4 text-xs font-medium">
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-green-500" />Hadir</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500" />Terlambat</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-neutral-200 dark:bg-neutral-800" />Absen</span>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col justify-end pt-4 pb-2">
                            {/* Visualisasi Bar Chart Sederhana (Responsive) */}
                            <div className="h-[200px] w-full flex items-end justify-between gap-2 px-2 border-b border-border pb-2">
                                {chartData.map((day) => {
                                    const hadirPct = (day.hadir / maxAttendance) * 100;
                                    const terlambatPct = (day.terlambat / maxAttendance) * 100;
                                    const tidakHadirPct = (day.tidak_hadir / maxAttendance) * 100;
                                    
                                    return (
                                        <div key={day.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                            
                                            {/* Tooltip Hover Info */}
                                            <div className="absolute bottom-full mb-2 bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 text-2xs p-2 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 w-28 text-center flex flex-col gap-0.5">
                                                <span className="font-semibold border-b pb-0.5 mb-0.5">{day.label}</span>
                                                <span className="text-green-500 font-medium">🟢 Hadir: {day.hadir}</span>
                                                <span className="text-amber-500 font-medium">🟡 Telat: {day.terlambat}</span>
                                                <span className="text-rose-500 font-medium">🔴 Absen: {day.tidak_hadir}</span>
                                            </div>
                                            
                                            {/* Bar Container */}
                                            <div className="w-full sm:w-10 rounded-t-md overflow-hidden flex flex-col justify-end bg-neutral-100 dark:bg-neutral-900/40 h-full">
                                                {/* Stacked bars */}
                                                <div 
                                                    className="w-full bg-neutral-200 dark:bg-neutral-800 transition-all duration-500" 
                                                    style={{ height: `${tidakHadirPct}%` }}
                                                />
                                                <div 
                                                    className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-500" 
                                                    style={{ height: `${terlambatPct}%` }}
                                                />
                                                <div 
                                                    className="w-full bg-green-500 hover:bg-green-600 transition-all duration-500" 
                                                    style={{ height: `${hadirPct}%` }}
                                                />
                                            </div>
                                            
                                            {/* Label Tanggal */}
                                            <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                                                {day.label.split(',')[0]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Widget Kalender (Kanan) */}
                    <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border flex flex-col justify-between">
                        <CardHeader className="pb-2 space-y-0.5">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                Kalender Akademik
                            </CardTitle>
                            <CardDescription>
                                {monthNames[currentMonth]} {currentYear}
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col justify-center">
                            {/* Grid Hari */}
                            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-muted-foreground mb-2">
                                <div>Sn</div><div>Sl</div><div>Rb</div><div>Km</div><div>Jm</div><div>Sb</div><div>Mg</div>
                            </div>
                            {/* Grid Tanggal */}
                            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                                {calendarCells.map((cell, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-7 w-7 flex items-center justify-center rounded-full font-medium ${
                                            cell === null ? 'opacity-0' :
                                            cell === todayDate ? 'bg-primary text-white shadow-sm' :
                                            'hover:bg-muted cursor-pointer'
                                        }`}
                                    >
                                        {cell}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Log Aktivitas Terkini (Bawah) */}
                <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" />
                                    Aktivitas Absensi Terbaru
                                </CardTitle>
                                <CardDescription>5 aktivitas scan absensi masuk atau pulang terbaru hari ini.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
                                        <th className="py-2.5">Mahasiswa</th>
                                        <th className="py-2.5">Kelas</th>
                                        <th className="py-2.5">Tipe Absen</th>
                                        <th className="py-2.5">Waktu Scan</th>
                                        <th className="py-2.5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((act) => (
                                            <tr key={act.id} className="hover:bg-muted/40 transition-colors">
                                                <td className="py-3 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            {act.gambar ? (
                                                                <AvatarImage
                                                                    src={`/storage/${act.gambar}`}
                                                                    className="object-cover"
                                                                />
                                                            ) : null}
                                                            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                                                {act.nama.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-semibold">{act.nama}</div>
                                                            <div className="text-[10px] text-muted-foreground font-mono">NIM: {act.nim}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted-foreground">{act.kelas}</td>
                                                <td className="py-3">
                                                    <Badge variant="outline" className={
                                                        act.tipe === 'Masuk' 
                                                            ? 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/40' 
                                                            : 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/40'
                                                    }>
                                                        {act.tipe}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 font-mono font-medium">{act.waktu} WIB</td>
                                                <td className="py-3 text-right">
                                                    <Badge className={
                                                        act.status === 'Hadir' ? 'bg-green-500 hover:bg-green-600' :
                                                        act.status === 'Terlambat' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-500 hover:bg-rose-600'
                                                    }>
                                                        {act.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2 justify-center">
                                                    <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                                                    <span>Belum ada aktivitas absensi tercatat hari ini.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
