"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteUserButtonProps = {
  userName: string;
};

export function DeleteUserButton({ userName }: DeleteUserButtonProps) {
  return (
    <Button
      type="submit"
      variant="danger"
      size="sm"
      onClick={(event) => {
        const confirmed = window.confirm(`Hapus akun ${userName}? Semua data belajar siswa ini akan ikut terhapus.`);
        if (!confirmed) event.preventDefault();
      }}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Hapus
    </Button>
  );
}
