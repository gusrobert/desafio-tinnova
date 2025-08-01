import { useState, useEffect } from 'react';
import { vehicleDataService } from '@/lib/vehicle-data';

interface VehicleNameProps {
  brandId?: string;
  modelId?: string;
  type: 'brand' | 'model';
}

export function VehicleName({ brandId, modelId, type }: VehicleNameProps) {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadName = async () => {
      if (type === 'brand' && brandId) {
        try {
          setLoading(true);
          const resolvedName = await vehicleDataService.getBrandNameAsync(brandId);
          setName(resolvedName);
        } catch (error) {
          console.error('Error loading brand name:', error);
          setName(brandId);
        } finally {
          setLoading(false);
        }
      } else if (type === 'model' && modelId) {
        try {
          setLoading(true);
          const resolvedName = await vehicleDataService.getModelNameAsync(modelId);
          setName(resolvedName);
        } catch (error) {
          console.error('Error loading model name:', error);
          setName(modelId);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setName(brandId || modelId || '');
      }
    };

    loadName();
  }, [brandId, modelId, type]);

  if (loading) {
    return <span className="text-muted-foreground">Carregando...</span>;
  }

  return <span>{name}</span>;
}
