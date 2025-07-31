"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // For styling consistency in AlertDialogAction

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string; // e.g., "professor", "estudante", "agendamento"
  title?: string;
  description?: string;
  confirmButtonText?: string;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  itemName,
  itemType,
  title,
  description,
  confirmButtonText
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title || `Confirmar Exclusão`}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || `Tem certeza que deseja excluir ${itemType === 'agendamento' ? '' : 'o(a) '}${itemType} "${itemName}"? Esta ação não pode ser desfeita.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button variant="destructive">{confirmButtonText || "Sim, Excluir"}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
