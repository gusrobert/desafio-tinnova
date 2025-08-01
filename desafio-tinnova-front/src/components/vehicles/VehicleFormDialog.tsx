"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Vehicle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BrandModelSelector } from "./BrandModelSelector";

const vehicleSchema = z.object({
    plate: z.string()
      .min(1, "Placa é obrigatória")
      .regex(/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$|^[A-Z]{3}-?\d{4}$/, "Formato de placa inválido (AAA-1234 ou AAA-1A23)"),
    modelId: z.string().min(1, "Modelo é obrigatório"),
    brandId: z.string().min(1, "Marca é obrigatória"),
    year: z.number()
      .min(1900, "Ano deve estar entre 1900 e o próximo ano")
      .max(new Date().getFullYear() + 1, "Ano deve estar entre 1900 e o próximo ano"),
    description: z.string().optional(),
    isSold: z.boolean().default(false),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  vehicle: Vehicle | null;
  onSubmit: (data: { plate: string; modelId: number; brandId: number; year: number; description?: string; isSold: boolean; id?: number }) => void;
}

export default function VehicleFormDialog({ isOpen, onOpenChange, vehicle, onSubmit }: VehicleFormDialogProps) {
  const { toast } = useToast();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: '',
      modelId: '',
      brandId: '',
      year: new Date().getFullYear(),
      description: '',
      isSold: false,
    },
  });

  useEffect(() => {
    if (vehicle) {
      setSelectedBrandId(vehicle.brandId?.toString() || '');
      setSelectedModelId(vehicle.modelId?.toString() || '');
      reset({
        plate: vehicle.plate || '',
        modelId: vehicle.modelId?.toString() || '',
        brandId: vehicle.brandId?.toString() || '',
        year: vehicle.year,
        description: vehicle.description || '',
        isSold: vehicle.isSold,
      });
    } else {
      setSelectedBrandId("");
      setSelectedModelId("");
      reset({
        plate: '',
        modelId: '',
        brandId: '',
        year: new Date().getFullYear(),
        description: '',
        isSold: false,
      });
    }
  }, [vehicle, reset, isOpen]);

  // Atualizar o form quando marca/modelo mudarem
  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    setValue("brandId", brandId);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    setValue("modelId", modelId);
  };

  const handleFormSubmit = (data: VehicleFormData) => {
     onSubmit({
      ...data,
      modelId: parseInt(data.modelId),
      brandId: parseInt(data.brandId),
      id: vehicle?.id, // Include id if editing
    });
    toast({
      title: `Veículo ${vehicle ? 'atualizado' : 'cadastrado'}!`,
      description: `Os dados do veículo foram salvos.`,
      variant: "default"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Editar Veículo" : "Cadastrar Veículo"}</DialogTitle>
          <DialogDescription>
            {vehicle ? "Altere os dados do veículo." : "Preencha os dados para cadastrar um novo veículo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4 pr-2">
          <h3 className="text-lg font-semibold border-b pb-2">Dados do Veículo</h3>
          
          {/* Seletor de Marca e Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrandModelSelector
              selectedBrandId={selectedBrandId}
              selectedModelId={selectedModelId}
              onBrandChange={handleBrandChange}
              onModelChange={handleModelChange}
            />
          </div>
          
          {/* Mensagens de erro para marca e modelo */}
          {errors.brandId && <p className="text-xs text-destructive">{errors.brandId.message}</p>}
          {errors.modelId && <p className="text-xs text-destructive">{errors.modelId.message}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plate">Placa *</Label>
              <Input 
                id="plate" 
                type="text"
                placeholder="Ex: ABC-1234 ou ABC-1A23"
                {...register("plate")} 
                className={errors.plate ? 'border-destructive' : ''} 
                maxLength={8}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.plate && <p className="text-xs text-destructive mt-1">{errors.plate.message}</p>}
            </div>
            <div>
              <Label htmlFor="year">Ano *</Label>
              <Input 
                id="year" 
                type="number"
                placeholder="Ex: 2023"
                {...register("year", { valueAsNumber: true })} 
                className={errors.year ? 'border-destructive' : ''} 
              />
              {errors.year && <p className="text-xs text-destructive mt-1">{errors.year.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva características do veículo..."
                rows={3}
                {...register("description")} 
                className={errors.description ? 'border-destructive' : ''} 
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Controller
                name="isSold"
                control={control}
                render={({ field }: { field: { value: boolean; onChange: (value: boolean) => void } }) => (
                  <Checkbox
                    id="isSold"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isSold">Veículo vendido</Label>
            </div>
          </div>
        
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {vehicle ? "Salvar Alterações" : "Cadastrar Veículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
