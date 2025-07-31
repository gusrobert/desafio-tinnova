"use client";

import { useState, useMemo } from "react";
import type { Student } from "@/lib/types";
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
import { Pencil, Trash2, CalendarPlus, MessageSquare, ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onScheduleClass: (studentId: string) => void;
}

type SortKey = keyof Pick<Student, "firstName" | "contacts">;


export default function StudentTable({ students, onEdit, onDelete, onScheduleClass }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    // RQF6.2: A tabela de listagem de estudantes deve estar em ordem alfabética (default).
    let filtered = students.filter(
      (student) =>
        (student.firstName.toLowerCase() + " " + student.lastName.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        student.cpf.includes(searchTerm) ||
        student.contacts.whatsapp.includes(searchTerm)
    );
    
    return filtered.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'contacts') { // Sort by WhatsApp, which is inside contacts
        valA = a.contacts.whatsapp;
        valB = b.contacts.whatsapp;
      } else {
        valA = a[sortKey];
        valB = b[sortKey];
      }
      
      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortOrder === "asc" ? comparison : comparison * -1;
    });
  }, [students, searchTerm, sortKey, sortOrder]);

  const confirmDelete = () => {
    if (studentToDelete) {
      onDelete(studentToDelete.id);
      setStudentToDelete(null);
    }
  };


  return (
    <div className="bg-card rounded-lg shadow-md w-full">
       <div className="px-6 pt-6 mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, CPF ou WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("firstName")} className="cursor-pointer hover:bg-muted/50">
                Nome Completo <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'firstName' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("contacts")} className="cursor-pointer hover:bg-muted/50">
                WhatsApp <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'contacts' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.length > 0 ? (
              filteredAndSortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                  <TableCell>
                    <Link 
                      href={`https://api.whatsapp.com/send/?phone=${student.contacts.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {student.contacts.whatsapp}
                    </Link>
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
                        <DropdownMenuItem onClick={() => onEdit(student)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onScheduleClass(student.id)}>
                          <CalendarPlus className="mr-2 h-4 w-4" /> Agendar Aula
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStudentToDelete(student)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Nenhum estudante encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {studentToDelete && (
         <DeleteConfirmationDialog
          isOpen={!!studentToDelete}
          onOpenChange={() => setStudentToDelete(null)}
          onConfirm={confirmDelete}
          itemName={`${studentToDelete.firstName} ${studentToDelete.lastName}`}
          itemType="estudante"
        />
      )}
    </div>
  );
}
