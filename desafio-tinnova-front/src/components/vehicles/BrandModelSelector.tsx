"use client";

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vehicleDataService, VehicleBrand, VehicleModel } from '@/lib/vehicle-data';

interface BrandModelSelectorProps {
  selectedBrandId?: string;
  selectedModelId?: string;
  onBrandChange: (brandId: string) => void;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function BrandModelSelector({
  selectedBrandId,
  selectedModelId,
  onBrandChange,
  onModelChange,
  disabled = false,
}: BrandModelSelectorProps) {
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  // Carregar marcas na inicialização
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoadingBrands(true);
        const brandsData = await vehicleDataService.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setLoadingBrands(false);
      }
    };

    loadBrands();
  }, []);

  // Carregar modelos quando a marca muda
  useEffect(() => {
    const loadModels = async () => {
      if (!selectedBrandId) {
        setModels([]);
        return;
      }

      try {
        setLoadingModels(true);
        const modelsData = await vehicleDataService.getModelsByBrand(selectedBrandId);
        setModels(modelsData);
      } catch (error) {
        console.error('Error loading models:', error);
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
  }, [selectedBrandId]);

  const handleBrandChange = (brandId: string) => {
    onBrandChange(brandId);
    // Limpar o modelo selecionado ao trocar de marca
    if (selectedModelId) {
      onModelChange("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Seletor de Marca */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Marca</label>
        <Select
          value={selectedBrandId || ""}
          onValueChange={handleBrandChange}
          disabled={disabled || loadingBrands}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={loadingBrands ? "Carregando marcas..." : "Selecione a marca"} 
            />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seletor de Modelo */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Modelo</label>
        <Select
          value={selectedModelId || ""}
          onValueChange={onModelChange}
          disabled={disabled || !selectedBrandId || loadingModels}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !selectedBrandId 
                  ? "Selecione uma marca primeiro"
                  : loadingModels 
                    ? "Carregando modelos..."
                    : "Selecione o modelo"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id.toString()}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
