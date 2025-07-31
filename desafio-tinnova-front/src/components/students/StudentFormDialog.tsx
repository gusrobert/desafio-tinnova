"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Student } from "@/lib/types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Dados completos para estados brasileiros
const states = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" }
];

const studentSchema = z.object({
  cpf: z.string().min(11, "CPF é obrigatório e deve ter 11 dígitos").max(14, "CPF inválido"),
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  dob: z.date().optional(),
  address: z.object({
    cep: z.string().min(8, "CEP é obrigatório").max(9, "CEP inválido"),
    street: z.string().min(1, "Logradouro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório (use 'SN' se não houver)"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    state: z.string().min(1, "Estado é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
  }).optional(),
  contacts: z.object({
    phone: z.string().optional(),
    whatsapp: z.string().min(10, "WhatsApp é obrigatório"), // Basic validation for length
    email: z.string().email("Email inválido").optional().or(z.literal('')),
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: Student | null;
  onSubmit: (data: Omit<Student, 'id' | 'registrationDate'> & { id?: string }) => void;
}

export default function StudentFormDialog({ isOpen, onOpenChange, student, onSubmit }: StudentFormDialogProps) {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<string | undefined>(student?.address?.state);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const { control, register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      cpf: '',
      firstName: '',
      lastName: '',
      dob: undefined,
      address: {
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        state: '',
        city: '',
      },
      contacts: {
        phone: '',
        whatsapp: '',
        email: '',
      },
    },
  });

  const watchedCep = watch("address.cep");

  useEffect(() => {
    if (student) {
      reset({
        ...student,
        dob: student.dob ? parseISO(student.dob) : undefined,
      });
      setSelectedState(student.address?.state);
    } else {
      reset({
        cpf: '', firstName: '', lastName: '', dob: undefined,
        address: { cep: '', street: '', number: '', neighborhood: '', state: '', city: '' },
        contacts: { phone: '', whatsapp: '', email: '' },
      });
      setSelectedState(undefined);
    }
  }, [student, reset, isOpen]);

  // Verifica se o estado existe na lista de estados
  const isValidState = (uf: string) => {
    return states.some(state => state.value === uf);
  };
  
  // Busca de CEP usando a API do ViaCEP
  useEffect(() => {
    const fetchAddressByCep = async (cep: string) => {
      try {
        setIsFetchingCep(true);
        const formattedCep = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
        
        if (!response.ok) {
          throw new Error('CEP não encontrado');
        }
        
        const data = await response.json();
        
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }
        
        // Preenche os campos com os dados retornados pela API
        setValue("address.street", data.logradouro || '');
        setValue("address.neighborhood", data.bairro || '');
        setValue("address.city", data.localidade || ''); // Preenche a cidade diretamente
        
        // Verifica se o estado retornado pela API está na lista de estados
        if (isValidState(data.uf)) {
          setValue("address.state", data.uf);
          setSelectedState(data.uf);
        } else {
          // Se o estado não estiver na lista, deixa o campo vazio
          setValue("address.state", "");
          setSelectedState(undefined);
          console.warn(`Estado ${data.uf} não encontrado na lista de estados`);
        }
        
        toast({ 
          title: "CEP encontrado!", 
          description: "Endereço preenchido automaticamente.", 
          variant: "default" 
        });
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast({ 
          title: "CEP não encontrado", 
          description: "Por favor, preencha o endereço manualmente.", 
          variant: "destructive" 
        });
      } finally {
        setIsFetchingCep(false);
      }
    };
    
    const cep = watchedCep?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      fetchAddressByCep(cep);
    }
  }, [watchedCep, setValue, toast]);

  const handleFormSubmit = (data: StudentFormData) => {
     onSubmit({
      ...data,
      id: student?.id, // Include id if editing
      dob: data.dob ? format(data.dob, "yyyy-MM-dd") : undefined,
    });
    toast({
      title: `Estudante ${student ? 'atualizado' : 'cadastrado'}!`,
      description: `Os dados de ${data.firstName} ${data.lastName} foram salvos.`,
      variant: "default"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <DialogHeader>
          <DialogTitle>{student ? "Editar Estudante" : "Cadastrar Estudante"}</DialogTitle>
          <DialogDescription>
            {student ? "Altere os dados do estudante." : "Preencha os dados para cadastrar um novo estudante."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4 pr-2">
          <h3 className="text-lg font-semibold border-b pb-2">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" {...register("cpf")} disabled={!!student} className={errors.cpf ? 'border-destructive' : ''} />
              {errors.cpf && <p className="text-xs text-destructive mt-1">{errors.cpf.message}</p>}
            </div>
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" {...register("firstName")} className={errors.firstName ? 'border-destructive' : ''} />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" {...register("lastName")} className={errors.lastName ? 'border-destructive' : ''} />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
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
                    <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"} ${errors.dob ? 'border-destructive' : ''}`}>
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
                      fromYear={1920} 
                      toYear={new Date().getFullYear()}
                      formatters={{
                        formatCaption: (date) => format(date, "MMMM yyyy", { locale: ptBR }),
                        formatMonthCaption: (month) => format(month, "MMMM", { locale: ptBR }),
                        formatYearCaption: (year) => format(year, "yyyy", { locale: ptBR }),
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dob && <p className="text-xs text-destructive mt-1">{errors.dob.message}</p>}
          </div>

          <h3 className="text-lg font-semibold border-b pb-2 pt-4">Endereço</h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Digite o CEP para preenchimento automático</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Abrir um modal para buscar CEP por endereço
                  toast({
                    title: "Busca por endereço",
                    description: "Para buscar o CEP por endereço, acesse o site dos Correios: https://buscacepinter.correios.com.br/",
                    variant: "default",
                    duration: 5000
                  });
                  // Abrir o site dos Correios em uma nova aba
                  window.open("https://buscacepinter.correios.com.br/", "_blank");
                }}
              >
                Não sei meu CEP
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("address.cep", "");
                  setValue("address.street", "");
                  setValue("address.neighborhood", "");
                  setValue("address.city", "");
                  setValue("address.state", "");
                  setSelectedState(undefined);
                }}
              >
                Limpar Endereço
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 relative">
              <Label htmlFor="address.cep">CEP</Label>
              <Input 
                id="address.cep" 
                {...register("address.cep")} 
                placeholder="00000-000"
                className={errors.address?.cep ? 'border-destructive' : ''}
                onChange={(e) => {
                  // Formata o CEP para o padrão 00000-000
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 5) {
                    value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
                  }
                  if (value.length > 9) {
                    value = value.slice(0, 9);
                  }
                  e.target.value = value;
                  register("address.cep").onChange(e);
                }}
                onBlur={(e) => {
                  // Quando o campo perde o foco, garante que tenha 8 dígitos numéricos
                  const cep = e.target.value.replace(/\D/g, '');
                  if (cep.length === 8) {
                    // A busca pelo CEP será acionada no useEffect
                  } else if (cep.length > 0) {
                    toast({
                      title: "CEP incompleto",
                      description: "Digite um CEP válido com 8 dígitos.",
                      variant: "destructive"
                    });
                  }
                }}
              />
              {isFetchingCep && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-muted-foreground" />}
              {errors.address?.cep && <p className="text-xs text-destructive mt-1">{errors.address.cep.message}</p>}
            </div>
             <div className="md:col-span-2">
              <Label htmlFor="address.street">Logradouro</Label>
              <Input id="address.street" {...register("address.street")} className={errors.address?.street ? 'border-destructive' : ''} />
              {errors.address?.street && <p className="text-xs text-destructive mt-1">{errors.address.street.message}</p>}
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="address.number">Número</Label>
              <Input id="address.number" {...register("address.number")} placeholder="Ex: 123 ou SN" className={errors.address?.number ? 'border-destructive' : ''} />
              {errors.address?.number && <p className="text-xs text-destructive mt-1">{errors.address.number.message}</p>}
            </div>
            <div>
              <Label htmlFor="address.neighborhood">Bairro</Label>
              <Input id="address.neighborhood" {...register("address.neighborhood")} className={errors.address?.neighborhood ? 'border-destructive' : ''} />
              {errors.address?.neighborhood && <p className="text-xs text-destructive mt-1">{errors.address.neighborhood.message}</p>}
            </div>
           <div>
              <Label htmlFor="address.state">Estado</Label>
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => { field.onChange(value); setSelectedState(value); setValue("address.city", ""); }} value={field.value}>
                    <SelectTrigger className={errors.address?.state ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default" disabled>Selecione o estado</SelectItem>
                      {states.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.address?.state && <p className="text-xs text-destructive mt-1">{errors.address.state.message}</p>}
            </div>
          </div>
          <div>
              <Label htmlFor="address.city">Cidade</Label>
              <Input
                id="address.city"
                {...register("address.city")}
                placeholder="Digite o nome da cidade"
                disabled={!selectedState}
                className={errors.address?.city ? 'border-destructive' : ''}
              />
              {errors.address?.city && <p className="text-xs text-destructive mt-1">{errors.address.city.message}</p>}
          </div>

          <h3 className="text-lg font-semibold border-b pb-2 pt-4">Contatos</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contacts.phone">Telefone/Celular</Label>
              <Input id="contacts.phone" {...register("contacts.phone")} />
            </div>
            <div>
              <Label htmlFor="contacts.whatsapp">WhatsApp</Label>
              <Input id="contacts.whatsapp" {...register("contacts.whatsapp")} className={errors.contacts?.whatsapp ? 'border-destructive' : ''} />
              {errors.contacts?.whatsapp && <p className="text-xs text-destructive mt-1">{errors.contacts.whatsapp.message}</p>}
            </div>
             <div>
              <Label htmlFor="contacts.email">E-mail</Label>
              <Input id="contacts.email" type="email" {...register("contacts.email")} className={errors.contacts?.email ? 'border-destructive' : ''} />
              {errors.contacts?.email && <p className="text-xs text-destructive mt-1">{errors.contacts.email.message}</p>}
            </div>
          </div>
        
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {student ? "Salvar Alterações" : "Cadastrar Estudante"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
