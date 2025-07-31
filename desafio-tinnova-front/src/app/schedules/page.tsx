"use client";

import { useState, Suspense, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ClassSession } from "@/lib/types";
import ScheduleFormDialog from "@/components/schedules/ScheduleFormDialog"; // Placeholder, will be created
import ScheduleTable from "@/components/schedules/ScheduleTable"; // Placeholder, will be created
import { useSearchParams } from 'next/navigation';
import { appointmentService } from "@/lib/appointment-service";
import { studentService } from "@/lib/student-service";
import { teacherService } from "@/lib/teacher-service";
import { useToast } from "@/components/ui/use-toast";

// Your page component
export default function SchedulesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulesContent /> {/* Component that uses useSearchParams */}
    </Suspense>
  )
}

// Separate component that uses useSearchParams
function SchedulesContent() {
  const searchParams = useSearchParams();
  const studentIdParam = searchParams.get('studentId'); // For pre-filling from student page

  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(!!studentIdParam); // Open form if studentId is passed
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [initialStudentId, setInitialStudentId] = useState<string | undefined>(studentIdParam || undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // State for storing students and teachers for form dropdowns and display
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Load all required data in parallel
        const [appointmentsData, studentsData, teachersData] = await Promise.all([
          appointmentService.getAll(),
          studentService.getAll(),
          teacherService.getAll()
        ]);
        
        setClassSessions(appointmentsData);
        setStudents(studentsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os agendamentos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);


  const handleAddSession = () => {
    setEditingSession(null);
    setInitialStudentId(undefined); // Clear initial student if opening manually
    setIsFormOpen(true);
  };

  const handleEditSession = (session: ClassSession) => {
    setEditingSession(session);
    setInitialStudentId(session.studentId);
    setIsFormOpen(true);
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      setLoading(true);
      
      // Get the current session
      const session = classSessions.find(s => s.id === sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Update its status to canceled
      const updatedSession = await appointmentService.update(sessionId, {
        ...session,
        status: 'canceled'
      });
      
      setClassSessions(prevSessions =>
        prevSessions.map(s => s.id === sessionId ? updatedSession : s)
      );
      
      toast({
        title: 'Agendamento cancelado',
        description: 'O agendamento foi cancelado com sucesso.',
      });
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o agendamento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (sessionData: Omit<ClassSession, 'id' | 'status' | 'studentName' | 'teacherName'> & { id?: string }) => {
    try {
      setLoading(true);
      
      // Find student and teacher info for display
      const student = students.find(s => s.id === sessionData.studentId);
      const teacher = teachers.find(t => t.id === sessionData.teacherId);
      
      const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
      const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
      
      if (editingSession && sessionData.id) {
        // Edit existing appointment
        const updatedSession = await appointmentService.update(sessionData.id, {
          ...sessionData,
          id: sessionData.id, // Ensure ID is passed
          status: editingSession.status,
          studentName,
          teacherName
        } as ClassSession);
        
        setClassSessions(prevSessions => 
          prevSessions.map(s => s.id === updatedSession.id ? updatedSession : s)
        );
        
        toast({
          title: 'Agendamento atualizado',
          description: 'O agendamento foi atualizado com sucesso.',
        });
      } else {
        // Create new appointment
        const newSession = await appointmentService.create({
          ...sessionData,
          id: 'temp-' + Date.now(), // Temporary ID that will be replaced by backend
          status: 'scheduled',
          studentName,
          teacherName
        } as ClassSession);
        
        setClassSessions(prevSessions => [...prevSessions, newSession]);
        
        toast({
          title: 'Agendamento criado',
          description: 'O agendamento foi criado com sucesso.',
        });
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o agendamento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <AppLayout pageTitle="Gestão de Horários">
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
            onClick={handleAddSession} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Agendar Aula
          </Button>
        </div>

        {/* RQF7.5 - Under 16 alert placeholder */}
        {/* This logic would be more complex and tied to form submission */}
        {/* <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader className="flex flex-row items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <CardTitle className="text-yellow-700">Atenção: Aluno Menor de Idade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-600">
              O aluno selecionado tem menos de 16 anos. É necessário obter a assinatura de um responsável.
            </p>
            <Button variant="outline" className="mt-2 border-yellow-600 text-yellow-700 hover:bg-yellow-100">
              Gerar Documento PDF
            </Button>
          </CardContent>
        </Card> */}
        
        <ScheduleTable 
          sessions={classSessions}
          onEdit={handleEditSession}
          onCancel={handleCancelSession}
        />

        <ScheduleFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          session={editingSession}
          onSubmit={handleFormSubmit}
          students={students}
          teachers={teachers}
          initialStudentId={initialStudentId}
        />
      </div>
    </AppLayout>
  );
}
