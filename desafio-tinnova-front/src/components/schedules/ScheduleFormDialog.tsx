"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ClassSession, Student, Teacher } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { format, parseISO, setHours, setMinutes, isBefore, addDays, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const scheduleSchema = z.object({
  dateTime: z.date({ required_error: "Data e hora são obrigatórias." }),
  studentId: z.string().min(1, "Estudante é obrigatório."),
  teacherId: z.string().min(1, "Professor é obrigatório."),
  content: z.string().min(1, "Conteúdo da aula é obrigatório.").max(500, "Conteúdo muito longo."),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  session: ClassSession | null;
  onSubmit: (data: Omit<ClassSession, 'id' | 'status' | 'studentName' | 'teacherName'> & { id?: string }) => void;
  students: Student[];
  teachers: Teacher[];
  initialStudentId?: string;
}

export default function ScheduleFormDialog({ 
  isOpen, onOpenChange, session, onSubmit, students, teachers, initialStudentId 
}: ScheduleFormDialogProps) {
  const { toast } = useToast();
  const { control, register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
     defaultValues: {
      dateTime: setMinutes(setHours(new Date(), 9),0), // Default to today 9:00 AM
      studentId: initialStudentId || '',
      teacherId: '',
      content: '',
    },
  });

  const watchedDateTime = watch("dateTime");
  const watchedStudentId = watch("studentId");

  useEffect(() => {
    if (session) {
      reset({
        dateTime: parseISO(session.dateTime),
        studentId: session.studentId,
        teacherId: session.teacherId,
        content: session.content,
      });
    } else {
       reset({
        dateTime: setMinutes(setHours(new Date(), 9),0),
        studentId: initialStudentId || '',
        teacherId: '',
        content: '',
      });
    }
  }, [session, reset, isOpen, initialStudentId]);
  
  // Placeholder for RQF7.5 - Under 16 alert
  const selectedStudent = students.find(s => s.id === watchedStudentId);
  const isStudentUnder16 = selectedStudent?.dob ? (getYear(new Date()) - getYear(parseISO(selectedStudent.dob))) < 16 : false;


  const handleFormSubmit = (data: ScheduleFormData) => {
    // RQF7.4: Agendamentos não podem ser realizados com menos de 24 horas de antecedência.
    if (isBefore(data.dateTime, addDays(new Date(), 1)) && !session) { // Check only for new sessions
      toast({
        title: "Agendamento Inválido",
        description: "Agendamentos devem ser feitos com pelo menos 24 horas de antecedência.",
        variant: "destructive",
      });
      return;
    }

    // RQF8.3: Alterações só podem ser feitas com até 24 horas de antecedência.
    if (session && isBefore(parseISO(session.dateTime), addDays(new Date(), 1))) {
        const originalDateTime = parseISO(session.dateTime);
        // Allow changing other fields if date/time remains the same or is in the future beyond 24h
        if (data.dateTime.toISOString() !== originalDateTime.toISOString() && isBefore(originalDateTime, addDays(new Date(),1)) ) {
             toast({
                title: "Prazo Expirado",
                description: "Alterações em agendamentos devem ser feitas com mais de 24 horas de antecedência da aula.",
                variant: "destructive",
            });
            return;
        }
    }
    
    // RQF7.2 & 7.3 (Mocked): Teacher availability and max 2 classes.
    // In a real app, this would involve checking teacher's schedule from DB.
    const teacherClassesToday = 0; // Mock this value.
    if (teacherClassesToday >= 2 && !session) { // Simplified check for new sessions
         toast({
            title: "Professor Indisponível",
            description: "Este professor já atingiu o limite de 2 aulas para este dia.",
            variant: "destructive",
        });
        return;
    }


    onSubmit({
      ...data,
      id: session?.id, // Include id if editing
      dateTime: data.dateTime.toISOString(),
    });

    toast({
      title: `Agendamento ${session ? 'atualizado' : 'criado'}!`,
      description: `Aula agendada para ${format(data.dateTime, "dd/MM/yyyy 'às' HH:mm")}.`,
      variant: "default"
    });

    if (isStudentUnder16 && !session) { // Show alert only for new underage student bookings
        toast({
            title: "Atenção: Aluno Menor de Idade!",
            description: "Lembre-se de obter a assinatura do responsável. (Simulação de alerta PDF)",
            variant: "default", // Or a custom variant
            duration: 7000, 
            action: <Button variant="outline" onClick={() => alert("Simulando download do PDF...")}>Gerar PDF</Button>
        });
    }
    onOpenChange(false);
  };

  // Mock time slots
  const timeSlots = Array.from({ length: (20-8)*2 }, (_, i) => { // 8 AM to 7:30 PM, 30 min intervals
    const hour = 8 + Math.floor(i/2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{session ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da aula.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
           {isStudentUnder16 && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5"/>
                <p className="text-sm text-yellow-700">
                Atenção: O estudante selecionado é menor de 16 anos. Ao salvar, um lembrete para o documento de autorização será exibido.
                </p>
            </div>
           )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data da Aula</Label>
              <Controller
                name="dateTime"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"} ${errors.dateTime ? 'border-destructive' : ''}`}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={(date) => {
                        if(date) {
                            const currentHour = field.value ? field.value.getHours() : 9;
                            const currentMinute = field.value ? field.value.getMinutes() : 0;
                            field.onChange(setMinutes(setHours(date, currentHour), currentMinute));
                        } else {
                            field.onChange(date);
                        }
                      }} initialFocus locale={ptBR} disabled={(date) => isBefore(date, new Date()) && !session} />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dateTime && <p className="text-xs text-destructive mt-1">{errors.dateTime.message}</p>}
            </div>
            <div>
              <Label htmlFor="time">Hora da Aula</Label>
               <Controller
                name="dateTime"
                control={control}
                render={({ field }) => (
                    <Select
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onValueChange={(timeString) => {
                            if(field.value && timeString){
                                const [hours, minutes] = timeString.split(':').map(Number);
                                field.onChange(setMinutes(setHours(field.value, hours), minutes));
                            }
                        }}
                    >
                        <SelectTrigger className={errors.dateTime ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selecione a hora" />
                        </SelectTrigger>
                        <SelectContent>
                            {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
                />
            </div>
          </div>

          <div>
            <Label htmlFor="studentId">Estudante</Label>
            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!!initialStudentId && !!session}>
                  <SelectTrigger className={errors.studentId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione um estudante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(s => <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.studentId && <p className="text-xs text-destructive mt-1">{errors.studentId.message}</p>}
          </div>

          <div>
            <Label htmlFor="teacherId">Professor</Label>
             <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.teacherId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.filter(t => t.status === 'active').map(t => <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.teacherId && <p className="text-xs text-destructive mt-1">{errors.teacherId.message}</p>}
          </div>

          <div>
            <Label htmlFor="content">Conteúdo da Aula</Label>
            <Textarea id="content" {...register("content")} rows={4} className={errors.content ? 'border-destructive' : ''} />
            {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
          </div>
        
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {session ? "Salvar Alterações" : "Agendar Aula"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
