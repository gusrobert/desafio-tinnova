"use client";

import { useState, useMemo } from "react";
import type { ClassSession } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, XCircle, CalendarDays, User, Briefcase, MessageSquare, ArrowUpDown, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { mockStudents } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"; // Re-use for cancel confirmation
import { Input } from "@/components/ui/input";

interface ScheduleTableProps {
  sessions: ClassSession[];
  onEdit: (session: ClassSession) => void;
  onCancel: (sessionId: string) => void;
}

type SortKey = "dateTime" | "studentName" | "teacherName" | "status";


export default function ScheduleTable({ sessions, onEdit, onCancel }: ScheduleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dateTime");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // Default to newest first
  const [sessionToCancel, setSessionToCancel] = useState<ClassSession | null>(null);

  const getStudentWhatsAppLink = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? `https://api.whatsapp.com/send/?phone=${student.contacts.whatsapp.replace(/\D/g, '')}` : "#";
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions.filter(
      (session) =>
        session.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const valA = sortKey === 'dateTime' ? parseISO(a.dateTime).getTime() : (a[sortKey] || '').toString().toLowerCase();
      const valB = sortKey === 'dateTime' ? parseISO(b.dateTime).getTime() : (b[sortKey] || '').toString().toLowerCase();
      
      let comparison = 0;
      if (valA > valB) comparison = 1;
      else if (valA < valB) comparison = -1;
      
      return sortOrder === "asc" ? comparison : comparison * -1;
    });
  }, [sessions, searchTerm, sortKey, sortOrder]);

  const confirmCancel = () => {
    if (sessionToCancel) {
      onCancel(sessionToCancel.id);
      setSessionToCancel(null);
    }
  };


  return (
    <div className="bg-card p-6 rounded-lg shadow-md w-full">
       <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por aluno, professor ou conteúdo..."
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
            <TableHead onClick={() => handleSort("dateTime")} className="cursor-pointer hover:bg-muted/50">
                Data/Hora <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'dateTime' ? 'text-primary' : ''}`} />
            </TableHead>
            <TableHead onClick={() => handleSort("studentName")} className="cursor-pointer hover:bg-muted/50">
                Estudante <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'studentName' ? 'text-primary' : ''}`} />
            </TableHead>
            <TableHead onClick={() => handleSort("teacherName")} className="cursor-pointer hover:bg-muted/50">
                Professor <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'teacherName' ? 'text-primary' : ''}`} />
            </TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead onClick={() => handleSort("status")} className="cursor-pointer hover:bg-muted/50">
                Status <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'status' ? 'text-primary' : ''}`} />
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedSessions.length > 0 ? (
            filteredAndSortedSessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(parseISO(session.dateTime), "dd/MM/yy HH:mm", { locale: ptBR })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {session.studentName}
                  <Link href={getStudentWhatsAppLink(session.studentId)} target="_blank" rel="noopener noreferrer" className="ml-2">
                    <MessageSquare className="h-4 w-4 text-primary hover:text-primary/80" />
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  {session.teacherName}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{session.content}</TableCell>
              <TableCell>
                <Badge 
                  variant={session.status === 'scheduled' ? 'default' : session.status === 'completed' ? 'outline' : 'destructive'}
                  className={session.status === 'scheduled' ? 'bg-blue-500 text-white' : session.status === 'completed' ? 'bg-green-500 text-white' : ''}
                >
                  {session.status === 'scheduled' && 'Agendada'}
                  {session.status === 'completed' && 'Concluída'}
                  {session.status === 'canceled' && 'Cancelada'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={session.status === 'completed' || session.status === 'canceled'}>
                        <span className="sr-only">Abrir menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(session)} disabled={session.status !== 'scheduled'}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSessionToCancel(session)} disabled={session.status !== 'scheduled'} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <XCircle className="mr-2 h-4 w-4" /> Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-24">
              Nenhum agendamento encontrado.
            </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
      </div>
      {sessionToCancel && (
         <DeleteConfirmationDialog
          isOpen={!!sessionToCancel}
          onOpenChange={() => setSessionToCancel(null)}
          onConfirm={confirmCancel}
          itemName={`a aula de ${sessionToCancel.studentName} em ${format(parseISO(sessionToCancel.dateTime), "dd/MM/yy HH:mm")}`}
          itemType="agendamento"
          confirmButtonText="Sim, Cancelar"
          title="Cancelar Agendamento"
        />
      )}
    </div>
  );
}
