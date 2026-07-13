import { router, useForm } from '@inertiajs/react';
import { MoreHorizontal, Trash2, User, Pencil, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { Mahasiswa } from '@/types/mahasiswa';

export function MahasiswaTableRow({
    siswa,
    index,
}: {
    siswa: Mahasiswa;
    index: number;
}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: siswa.nama || '',
        nim: siswa.nim || '',
        kelas: siswa.kelas || '',
        nomor_orangtua: siswa.nomor_orangtua || '',
        alamat: siswa.alamat || '',
        gambar: null as File | null,
    });

    const handleDelete = () => {
        router.delete(`/mahasiswa/${siswa.id}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false),
                toast.success('Data mahasiswa berhasil dihapus!');
            },
            onError: () => {
                toast.error('Gagal menghapus data mahasiswa.');
            }
        });
    };

    const openEditDialog = () => {
        setData({
            nama: siswa.nama || '',
            nim: siswa.nim || '',
            kelas: siswa.kelas || '',
            nomor_orangtua: siswa.nomor_orangtua || '',
            alamat: siswa.alamat || '',
            gambar: null,
        });
        setPreviewUrl(null);
        setIsEditDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('gambar', file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setData('gambar', null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/mahasiswa/${siswa.id}`, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setPreviewUrl(null);
                reset('gambar');
                toast.success('Data mahasiswa berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui data mahasiswa.');
            }
        });
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <>
            <TableRow>
                <TableCell className="text-center font-medium">
                    {index + 1}
                </TableCell>
                <TableCell className="font-mono text-xs">
                    {siswa.uid_kartu}
                </TableCell>
                <TableCell>{siswa.nim || '-'}</TableCell>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            {siswa.gambar ? (
                                <AvatarImage
                                    src={`/storage/${siswa.gambar}`}
                                    alt={siswa.nama || ''}
                                    className="object-cover"
                                />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                {siswa.nama
                                    ? siswa.nama.substring(0, 2).toUpperCase()
                                    : '?'}
                            </AvatarFallback>
                        </Avatar>
                        <span>{siswa.nama || '-'}</span>
                    </div>
                </TableCell>
                <TableCell>{siswa.kelas || '-'}</TableCell>
                <TableCell>{siswa.nomor_orangtua || '-'}</TableCell>
                <TableCell>
                    {siswa.nama && siswa.nim ? (
                        <Badge
                            variant="default"
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Lengkap
                        </Badge>
                    ) : (
                        <Badge variant="destructive">Belum Lengkap</Badge>
                    )}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => setIsProfileOpen(true)}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Lihat Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={openEditDialog}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Profile Mahasiswa</DialogTitle>
                        <DialogDescription>
                            Informasi detail mengenai data mahasiswa yang terdaftar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-3 border-b py-4">
                        <Avatar className="h-24 w-24 border shadow-sm">
                            {siswa.gambar ? (
                                <AvatarImage
                                    src={`/storage/${siswa.gambar}`}
                                    alt={siswa.nama || ''}
                                    className="object-cover"
                                />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                                {siswa.nama
                                    ? siswa.nama.substring(0, 2).toUpperCase()
                                    : '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">
                                {siswa.nama || 'Belum Ada Nama'}
                            </h3>
                            <p className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 font-mono text-sm text-muted-foreground">
                                {siswa.uid_kartu}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-3 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                NIM
                            </span>
                            <span className="col-span-2 text-sm font-medium">
                                {siswa.nim || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                Kelas
                            </span>
                            <span className="col-span-2 text-sm font-medium">
                                {siswa.kelas || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                No. Telepon WA
                            </span>
                            <span className="col-span-2 text-sm font-medium">
                                {siswa.nomor_orangtua || '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-start gap-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                Alamat
                            </span>
                            <span className="col-span-2 text-sm font-medium whitespace-pre-wrap">
                                {siswa.alamat || '-'}
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[540px]">
                    <DialogHeader>
                        <DialogTitle>Edit Data Mahasiswa</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi data mahasiswa di bawah ini. UID Kartu tidak dapat diubah.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* UID Kartu (Read-only) */}
                            <div className="space-y-1.5">
                                <Label htmlFor="uid_kartu" className="text-xs font-semibold">UID Kartu</Label>
                                <Input
                                    id="uid_kartu"
                                    value={siswa.uid_kartu}
                                    disabled
                                    className="cursor-not-allowed bg-muted font-mono text-xs opacity-80"
                                />
                            </div>

                            {/* NIM */}
                            <div className="space-y-1.5">
                                <Label htmlFor="nim" className="text-xs font-semibold">NIM</Label>
                                <Input
                                    id="nim"
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    placeholder="Contoh: F11.2023.00076"
                                    className="text-xs font-medium"
                                />
                                {errors.nim && (
                                    <p className="text-[10px] text-destructive">
                                        {errors.nim}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Nama Mahasiswa */}
                            <div className="space-y-1.5">
                                <Label htmlFor="nama" className="text-xs font-semibold">Nama Mahasiswa</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Masukkan Nama Mahasiswa..."
                                    className="text-xs font-medium"
                                    required
                                />
                                {errors.nama && (
                                    <p className="text-[10px] text-destructive">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Kelas / Prodi */}
                            <div className="space-y-1.5">
                                <Label htmlFor="kelas" className="text-xs font-semibold">Kelas / Prodi</Label>
                                <Input
                                    id="kelas"
                                    value={data.kelas}
                                    onChange={(e) => setData('kelas', e.target.value)}
                                    placeholder="Masukkan Kelas..."
                                    className="text-xs font-medium"
                                />
                                {errors.kelas && (
                                    <p className="text-[10px] text-destructive">
                                        {errors.kelas}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* No Telepon Orangtua */}
                        <div className="space-y-1.5">
                            <Label htmlFor="nomor_orangtua" className="text-xs font-semibold">
                                No. Telepon Orang Tua (WhatsApp)
                            </Label>
                            <Input
                                id="nomor_orangtua"
                                value={data.nomor_orangtua}
                                onChange={(e) => setData('nomor_orangtua', e.target.value)}
                                placeholder="Contoh: 08123456789"
                                className="text-xs font-medium"
                            />
                            {errors.nomor_orangtua && (
                                <p className="text-[10px] text-destructive">
                                    {errors.nomor_orangtua}
                                </p>
                            )}
                        </div>

                        {/* Alamat */}
                        <div className="space-y-1.5">
                            <Label htmlFor="alamat" className="text-xs font-semibold">Alamat Lengkap</Label>
                            <Textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                placeholder="Masukkan alamat lengkap..."
                                className="text-xs min-h-[70px] resize-none font-medium"
                            />
                            {errors.alamat && (
                                <p className="text-[10px] text-destructive">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>

                        {/* Foto / Gambar Mahasiswa */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Foto Mahasiswa</Label>
                            <div className="flex items-center gap-4 p-3 border border-dashed rounded-lg bg-neutral-50/50 dark:bg-neutral-900/10">
                                <Avatar className="h-16 w-16 border shadow-sm flex-shrink-0">
                                    {previewUrl ? (
                                        <AvatarImage src={previewUrl} className="object-cover" />
                                    ) : (
                                        siswa.gambar && (
                                            <AvatarImage src={`/storage/${siswa.gambar}`} className="object-cover" />
                                        )
                                    )}
                                    <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                                        {data.nama ? data.nama.substring(0, 2).toUpperCase() : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1.5">
                                    <Label 
                                        htmlFor="gambar" 
                                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-md bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                                    >
                                        <Upload className="h-3.5 w-3.5" /> Pilih Foto
                                    </Label>
                                    <Input
                                        id="gambar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="text-[10px] text-muted-foreground truncate max-w-[250px]">
                                        {data.gambar ? (data.gambar as File).name : 'Format: JPG, JPEG, PNG. Maks: 2MB'}
                                    </div>
                                </div>
                            </div>
                            {errors.gambar && (
                                <p className="text-[10px] text-destructive">
                                    {errors.gambar}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data mahasiswa{' '}
                            <strong className="text-foreground">
                                {siswa.nama || siswa.uid_kartu}
                            </strong>
                            ? Tindakan ini tidak dapat dibatalkan dan data akan
                            dihapus secara permanen dari sistem.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Ya, Hapus Data
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
