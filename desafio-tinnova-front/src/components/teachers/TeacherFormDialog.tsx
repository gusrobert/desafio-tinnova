"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Teacher } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const teacherSchema = z.object({
  cpf: z.string().min(11, "CPF é obrigatório e deve ter 11 dígitos").max(14, "CPF inválido"), // Allow formatted CPF
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  dob: z.date().optional(),
  specialty: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teacher: Teacher | null;
  onSubmit: (data: Omit<Teacher, 'id' | 'hireDate'> & { id?: string }) => void;
}

export default function TeacherFormDialog({ isOpen, onOpenChange, teacher, onSubmit }: TeacherFormDialogProps) {
  const { toast } = useToast();
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      cpf: '',
      firstName: '',
      lastName: '',
      dob: undefined,
      specialty: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (teacher) {
      reset({
        cpf: teacher.cpf,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        dob: teacher.dob ? parseISO(teacher.dob) : undefined,
        specialty: teacher.specialty || '',
        status: teacher.status,
      });
    } else {
      reset({
        cpf: '',
        firstName: '',
        lastName: '',
        dob: undefined,
        specialty: '',
        status: 'active',
      });
    }
  }, [teacher, reset, isOpen]);

  const handleFormSubmit = (data: TeacherFormData) => {
    onSubmit({
      ...data,
      id: teacher?.id, // Include id if editing
      dob: data.dob ? format(data.dob, "yyyy-MM-dd") : undefined,
    });
    toast({
      title: `Professor ${teacher ? 'atualizado' : 'cadastrado'}!`,
      description: `Os dados de ${data.firstName} ${data.lastName} foram salvos.`,
      variant: "default"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{teacher ? "Editar Professor" : "Cadastrar Professor"}</DialogTitle>
          <DialogDescription>
            {teacher ? "Altere os dados do professor." : "Preencha os dados para cadastrar um novo professor."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" {...register("cpf")} disabled={!!teacher} className={errors.cpf ? 'border-destructive' : ''}/>
            {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" {...register("firstName")} className={errors.firstName ? 'border-destructive' : ''}/>
              {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" {...register("lastName")} className={errors.lastName ? 'border-destructive' : ''}/>
              {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="dob">Data de Nascimento</Label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"} ${errors.dob ? 'border-destructive' : ''}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ptBR}
                      captionLayout="dropdown-buttons"
                      fromYear={1950}
                      toYear={new Date().getFullYear() - 18} // Assuming teachers are at least 18
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dob && <p className="text-sm text-destructive mt-1">{errors.dob.message}</p>}
          </div>

          <div>
            <Label htmlFor="specialty">Especialidade</Label>
            <Input id="specialty" {...register("specialty")} />
          </div>

          <div>
            <Label htmlFor="status" className="flex items-center">Status</Label>
             <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="status"
                      checked={field.value === "active"}
                      onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                    />
                    <Label htmlFor="status" className="text-sm">
                      {field.value === "active" ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                )}
              />
          </div>
        
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {teacher ? "Salvar Alterações" : "Cadastrar Professor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
