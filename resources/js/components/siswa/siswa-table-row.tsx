import { TableCell, TableRow } from "@/components/ui/table";
import { Siswa } from "@/types/siswa";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function SiswaTableRow({ siswa, index }: { siswa: Siswa, index: number }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/siswa/${siswa.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell className="font-mono text-xs">{siswa.uid_kartu}</TableCell>
                <TableCell>{siswa.nis || "-"}</TableCell>
                <TableCell className="font-medium">{siswa.nama || "-"}</TableCell>
                <TableCell>{siswa.kelas || "-"}</TableCell>
                <TableCell>{siswa.nomor_orangtua || "-"}</TableCell>
                <TableCell>
                    {siswa.nama && siswa.nis ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Lengkap</Badge>
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
                            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                                <User className="mr-2 h-4 w-4" />
                                Lihat Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Profile Siswa</DialogTitle>
                        <DialogDescription>
                            Informasi detail mengenai data siswa yang terdaftar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Nama</span>
                            <span className="col-span-3">{siswa.nama || "-"}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">UID Kartu</span>
                            <span className="col-span-3 font-mono text-sm bg-muted p-1 rounded w-fit">{siswa.uid_kartu}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">NIS</span>
                            <span className="col-span-3">{siswa.nis || "-"}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Kelas</span>
                            <span className="col-span-3">{siswa.kelas || "-"}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">No. Telepon</span>
                            <span className="col-span-3">{siswa.nomor_orangtua || "-"}</span>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <span className="font-medium">Alamat</span>
                            <span className="col-span-3">{siswa.alamat || "-"}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data siswa <strong className="text-foreground">{siswa.nama || siswa.uid_kartu}</strong>? Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen dari sistem.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
