"use client";

import { useState, useMemo } from "react";
import type { Teacher } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ArrowUpDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";


interface TeacherTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
}

type SortKey = keyof Pick<Teacher, "firstName" | "specialty" | "status">;

export default function TeacherTable({ teachers, onEdit, onDelete }: TeacherTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedTeachers = useMemo(() => {
    let filtered = teachers.filter(
      (teacher) =>
        (teacher.firstName.toLowerCase() + " " + teacher.lastName.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        teacher.cpf.includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      // Handle undefined values (specially for optional fields like specialty)
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return sortOrder === "asc" ? 1 : -1;
      if (valB === undefined) return sortOrder === "asc" ? -1 : 1;

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortOrder === "asc" ? comparison : comparison * -1;
    });
  }, [teachers, searchTerm, sortKey, sortOrder]);

  const confirmDelete = () => {
    if (teacherToDelete) {
      onDelete(teacherToDelete.id);
      setTeacherToDelete(null);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md w-full">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("firstName")} className="cursor-pointer hover:bg-muted/50">
                Nome Completo <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'firstName' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("specialty")} className="cursor-pointer hover:bg-muted/50">
                Especialidade <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'specialty' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer hover:bg-muted/50">
                Status <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'status' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTeachers.length > 0 ? (
              filteredAndSortedTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell>{teacher.specialty || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === "active" ? "default" : "outline"} className={teacher.status === "active" ? "bg-green-500 text-white" : ""}>
                      {teacher.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(teacher)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTeacherToDelete(teacher)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Nenhum professor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {teacherToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!teacherToDelete}
          onOpenChange={() => setTeacherToDelete(null)}
          onConfirm={confirmDelete}
          itemName={`${teacherToDelete.firstName} ${teacherToDelete.lastName}`}
          itemType="professor"
        />
      )}
    </div>
  );
}
