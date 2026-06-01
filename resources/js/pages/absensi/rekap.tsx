import { Head, Link } from '@inertiajs/react';
import { GraduationCap, Users, Calendar, ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface ClassSummary {
    kelas: string;
    total_siswa: number;
    total_absen: number;
    hadir_hari_ini: number;
}

interface Props {
    classes: ClassSummary[];
}

export default function RekapAbsensi({ classes }: Props) {
    return (
        <>
            <Head title="Rekap Absensi Kelas" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Rekap Absensi Kelas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pilih kelas untuk melihat histori dan detail absensi
                        siswa secara berkala.
                    </p>
                </div>

                {classes.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-sidebar-border/70 p-12 text-center shadow-sm dark:border-sidebar-border">
                        <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <CardTitle className="mb-2 text-lg">
                            Belum Ada Data Kelas
                        </CardTitle>
                        <CardDescription>
                            Pastikan data siswa telah diinput dan memiliki kelas
                            yang terdaftar.
                        </CardDescription>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {classes.map((c) => (
                            <Link
                                key={c.kelas}
                                href={`/absensi/rekap/${encodeURIComponent(c.kelas)}`}
                                className="group block focus:outline-none"
                            >
                                <Card className="relative h-full overflow-hidden border-sidebar-border/70 shadow-sm transition-all duration-300 group-focus:ring-2 group-focus:ring-primary hover:border-primary/50 hover:shadow-md dark:border-sidebar-border">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                                        <GraduationCap className="h-24 w-24 text-primary" />
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                                Kelas Aktif
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                                        </div>
                                        <CardTitle className="mt-2 text-xl font-bold transition-colors group-hover:text-primary">
                                            Kelas {c.kelas}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="flex flex-col gap-4 pt-2">
                                        <div className="grid grid-cols-2 gap-4 border-t border-muted/50 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">
                                                        Siswa
                                                    </span>
                                                    <span className="text-sm font-semibold">
                                                        {c.total_siswa} orang
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-md bg-green-50 p-1.5 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">
                                                        Hari Ini
                                                    </span>
                                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {c.hadir_hari_ini} hadir
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs">
                                            <span className="text-muted-foreground">
                                                Total Absensi Keseluruhan:
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {c.total_absen} record
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

RekapAbsensi.layout = {
    breadcrumbs: [
        {
            title: 'Rekap Absensi',
            href: '/absensi/rekap',
        },
    ],
};
