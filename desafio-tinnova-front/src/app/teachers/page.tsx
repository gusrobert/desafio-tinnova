"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import TeacherTable from "@/components/teachers/TeacherTable";
import TeacherFormDialog from "@/components/teachers/TeacherFormDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import type { Teacher } from "@/lib/types";
import { teacherService } from "@/lib/teacher-service";
import { useToast } from "@/components/ui/use-toast";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const teacherData = await teacherService.getAll();
        setTeachers(teacherData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de professores.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [toast]);

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      setLoading(true);
      await teacherService.delete(teacherId);
      setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== teacherId));
      toast({
        title: 'Sucesso',
        description: 'Professor excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o professor.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (teacherData: Omit<Teacher, 'id' | 'hireDate'> & { id?: string }) => {
    try {
      setLoading(true);
      
      if (editingTeacher && teacherData.id) {
        // Edit existing teacher
        const updatedTeacher = await teacherService.update(teacherData.id, {
          ...teacherData,
          id: teacherData.id,
          hireDate: editingTeacher.hireDate
        } as Teacher);
        
        setTeachers(prevTeachers => 
          prevTeachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)
        );
        
        toast({
          title: 'Sucesso',
          description: 'Professor atualizado com sucesso.',
        });
      } else {
        // Create new teacher
        const newTeacher = await teacherService.create({
          ...teacherData,
          id: 'new', // This will be replaced by the backend
          hireDate: new Date().toISOString(),
          status: teacherData.status || 'active',
        } as Teacher);
        
        setTeachers(prevTeachers => [...prevTeachers, newTeacher]);
        
        toast({
          title: 'Sucesso',
          description: 'Professor cadastrado com sucesso.',
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o professor.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AppLayout pageTitle="Gestão de Professores">
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
            onClick={handleAddTeacher} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Cadastrar Professor
          </Button>
        </div>
        
        <TeacherTable
          teachers={teachers}
          onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
        />
        
        <TeacherFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          teacher={editingTeacher}
          onSubmit={handleFormSubmit}
        />
      </div>
    </AppLayout>
  );
}
