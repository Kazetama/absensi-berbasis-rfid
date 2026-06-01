import { router, useForm } from '@inertiajs/react';
import { MoreHorizontal, Trash2, User, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import type { Siswa } from '@/types/siswa';

export function SiswaTableRow({
    siswa,
    index,
}: {
    siswa: Siswa;
    index: number;
}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: siswa.nama || '',
        nis: siswa.nis || '',
        kelas: siswa.kelas || '',
        nomor_orangtua: siswa.nomor_orangtua || '',
        alamat: siswa.alamat || '',
        gambar: null as File | null,
    });

    const handleDelete = () => {
        router.delete(`/siswa/${siswa.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    const openEditDialog = () => {
        setData({
            nama: siswa.nama || '',
            nis: siswa.nis || '',
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
        post(`/siswa/${siswa.id}`, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setPreviewUrl(null);
                reset('gambar');
            },
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
                <TableCell>{siswa.nis || '-'}</TableCell>
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
                    {siswa.nama && siswa.nis ? (
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
                        <DialogTitle>Profile Siswa</DialogTitle>
                        <DialogDescription>
                            Informasi detail mengenai data siswa yang terdaftar.
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
                                NIS
                            </span>
                            <span className="col-span-2 text-sm font-medium">
                                {siswa.nis || '-'}
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
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Data Siswa</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi data siswa di bawah ini. UID
                            Kartu tidak dapat diubah.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        {/* UID Kartu (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="uid_kartu">UID Kartu</Label>
                            <Input
                                id="uid_kartu"
                                value={siswa.uid_kartu}
                                disabled
                                className="cursor-not-allowed bg-muted font-mono opacity-80"
                            />
                        </div>

                        {/* NIS */}
                        <div className="space-y-2">
                            <Label htmlFor="nis">NIS</Label>
                            <Input
                                id="nis"
                                value={data.nis}
                                onChange={(e) => setData('nis', e.target.value)}
                                placeholder="Masukkan NIS..."
                            />
                            {errors.nis && (
                                <p className="text-xs text-destructive">
                                    {errors.nis}
                                </p>
                            )}
                        </div>

                        {/* Nama Siswa */}
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Siswa</Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) =>
                                    setData('nama', e.target.value)
                                }
                                placeholder="Masukkan Nama Siswa..."
                                required
                            />
                            {errors.nama && (
                                <p className="text-xs text-destructive">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        {/* Kelas */}
                        <div className="space-y-2">
                            <Label htmlFor="kelas">Kelas</Label>
                            <Input
                                id="kelas"
                                value={data.kelas}
                                onChange={(e) =>
                                    setData('kelas', e.target.value)
                                }
                                placeholder="Masukkan Kelas..."
                            />
                            {errors.kelas && (
                                <p className="text-xs text-destructive">
                                    {errors.kelas}
                                </p>
                            )}
                        </div>

                        {/* No Telepon Orangtua */}
                        <div className="space-y-2">
                            <Label htmlFor="nomor_orangtua">
                                No. Telepon Orang Tua
                            </Label>
                            <Input
                                id="nomor_orangtua"
                                value={data.nomor_orangtua}
                                onChange={(e) =>
                                    setData('nomor_orangtua', e.target.value)
                                }
                                placeholder="Masukkan nomor telepon whatsapp..."
                            />
                            {errors.nomor_orangtua && (
                                <p className="text-xs text-destructive">
                                    {errors.nomor_orangtua}
                                </p>
                            )}
                        </div>

                        {/* Alamat */}
                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) =>
                                    setData('alamat', e.target.value)
                                }
                                placeholder="Masukkan alamat lengkap..."
                            />
                            {errors.alamat && (
                                <p className="text-xs text-destructive">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>

                        {/* Foto / Gambar Siswa */}
                        <div className="space-y-2">
                            <Label htmlFor="gambar">Foto Siswa</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 animate-in border duration-200 zoom-in-95 fade-in">
                                    {previewUrl ? (
                                        <AvatarImage
                                            src={previewUrl}
                                            className="object-cover"
                                        />
                                    ) : (
                                        siswa.gambar && (
                                            <AvatarImage
                                                src={`/storage/${siswa.gambar}`}
                                                className="object-cover"
                                            />
                                        )
                                    )}
                                    <AvatarFallback className="bg-primary/10 text-lg text-primary">
                                        {data.nama
                                            ? data.nama
                                                  .substring(0, 2)
                                                  .toUpperCase()
                                            : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid w-full items-center gap-1.5">
                                    <Input
                                        id="gambar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        Format: JPG, JPEG, PNG. Maks: 2MB
                                    </span>
                                </div>
                            </div>
                            {errors.gambar && (
                                <p className="text-xs text-destructive">
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
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
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
                            Apakah Anda yakin ingin menghapus data siswa{' '}
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
