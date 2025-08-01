"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import VehicleFormDialog from "@/components/vehicles/VehicleFormDialog";
import VehicleTable from "@/components/vehicles/VehicleTable";
import type { Vehicle } from "@/lib/types";
import { vehicleService } from "@/lib/vehicle-service";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehiclesData = await vehicleService.getAll();
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de veículos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [toast]);

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      setLoading(true);
      await vehicleService.delete(vehicleId);
      
      toast({
        title: 'Sucesso',
        description: 'Veículo excluído com sucesso.',
      });
      
      // Fazer nova busca para atualizar a tabela com dados frescos do backend
      const refreshedVehicles = await vehicleService.getAll();
      setVehicles(refreshedVehicles);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o veículo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (vehicleData: { modelId: number; brandId: number; year: number; description?: string; isSold: boolean; id?: number }) => {
    try {
      setLoading(true);

      if (editingVehicle && vehicleData.id) {
        // Edit existing vehicle
        await vehicleService.update(vehicleData.id, {
          ...vehicleData,
          id: vehicleData.id,
          brandName: '', // Será preenchido pela nova busca
          modelName: '', // Será preenchido pela nova busca
          createdAt: editingVehicle.createdAt,
          updatedAt: new Date().toISOString()
        } as Vehicle);
        
        toast({
          title: 'Sucesso',
          description: 'Veículo atualizado com sucesso.',
        });
      } else {
        // Create new vehicle
        await vehicleService.create({
          ...vehicleData,
          id: 0, // This will be replaced by the backend
          brandName: '', // Será preenchido pela nova busca
          modelName: '', // Será preenchido pela nova busca
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Vehicle);
        
        toast({
          title: 'Sucesso',
          description: 'Veículo cadastrado com sucesso.',
        });
      }
      
      // Fechar o modal primeiro
      setIsFormOpen(false);
      
      // Fazer nova busca para atualizar a tabela com dados frescos do backend
      const refreshedVehicles = await vehicleService.getAll();
      setVehicles(refreshedVehicles);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o veículo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="Gestão de Veículos">
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
            onClick={handleAddVehicle} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Veículo
          </Button>
        </div>

        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />

        <VehicleFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
        />
      </div>
    </AppLayout>
  );
}
