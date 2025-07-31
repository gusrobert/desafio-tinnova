"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StudentTable from "@/components/students/StudentTable";
import StudentFormDialog from "@/components/students/StudentFormDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import type { Student } from "@/lib/types";
import { studentService } from "@/lib/student-service";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await studentService.getAll();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de estudantes.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setLoading(true);
      await studentService.delete(studentId);
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
      toast({
        title: 'Sucesso',
        description: 'Estudante excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o estudante.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleScheduleClass = (studentId: string) => {
    console.log("Schedule class for student:", studentId);
    // RQF6.2.4 - A ação de realizar um agendamento deverá direcionar o usuário para a tela de listagem de agendamentos.
    router.push(`/schedules?studentId=${studentId}`);
  };

  const handleFormSubmit = async (studentData: Omit<Student, 'id' | 'registrationDate'> & { id?: string }) => {
    try {
      setLoading(true);
      
      if (editingStudent && studentData.id) {
        // Edit existing student
        const updatedStudent = await studentService.update(studentData.id, {
          ...studentData,
          id: studentData.id,
          registrationDate: editingStudent.registrationDate
        } as Student);
        
        setStudents(prevStudents => 
          prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
        );
        
        toast({
          title: 'Sucesso',
          description: 'Estudante atualizado com sucesso.',
        });
      } else {
        // Create new student
        const newStudent = await studentService.create({
          ...studentData,
          id: 'new', // This will be replaced by the backend
          registrationDate: new Date().toISOString(),
        } as Student);
        
        setStudents(prevStudents => [...prevStudents, newStudent]);
        
        toast({
          title: 'Sucesso',
          description: 'Estudante cadastrado com sucesso.',
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o estudante.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="Gestão de Estudantes">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          {loading && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Carregando...
            </div>
          )}
          <div className="flex-grow"></div>
          <Button 
            onClick={handleAddStudent} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Estudante
          </Button>
        </div>
        
        <StudentTable
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onScheduleClass={handleScheduleClass}
        />
        
        <StudentFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          student={editingStudent}
          onSubmit={handleFormSubmit}
        />
      </div>
    </AppLayout>
  );
}
