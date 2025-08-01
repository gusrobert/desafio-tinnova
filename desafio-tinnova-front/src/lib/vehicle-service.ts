import { ApiClient } from './api-client';
import { endpoints } from './api-config';
import { Vehicle } from './types';

// Mapear do formato do backend para o formato do frontend
const mapVehicleFromBackend = (data: any): Vehicle => {
  return {
    id: data.id,
    plate: data.plate || '',
    modelId: data.modelId || data.model?.id,
    brandId: data.brandId || data.brand?.id,
    modelName: data.model?.name || data.modelName || data.vehicle || '',
    brandName: data.brand?.name || data.brandName || '',
    year: data.year,
    description: data.description || '',
    isSold: data.isSold || data.sold || false,
    createdAt: data.createdAt || data.created || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated || new Date().toISOString(),
  };
};

// Mapear do formato do frontend para o formato do backend
const mapVehicleToBackend = (vehicle: Vehicle): any => {
  return {
    plate: vehicle.plate,
    modelId: vehicle.modelId,
    brandId: vehicle.brandId,
    year: vehicle.year,
    description: vehicle.description,
    isSold: vehicle.isSold,
  };
};

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    try {
      const data = await ApiClient.get<any[]>(endpoints.vehicles.base);
      return data.map(mapVehicleFromBackend);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Vehicle> {
    try {
      const data = await ApiClient.get<any>(endpoints.vehicles.byId(id.toString()));
      return mapVehicleFromBackend(data);
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  async create(vehicle: Vehicle): Promise<Vehicle> {
    try {
      const data = await ApiClient.post<any>(
        `${endpoints.vehicles.base}`,
        mapVehicleToBackend(vehicle)
      );
      return mapVehicleFromBackend(data);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  async update(id: number, vehicle: Vehicle): Promise<Vehicle> {
    try {
      const data = await ApiClient.put<any>(
        endpoints.vehicles.byId(id.toString()),
        mapVehicleToBackend(vehicle)
      );
      return mapVehicleFromBackend(data);
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await ApiClient.delete(endpoints.vehicles.byId(id.toString()));
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get vehicles statistics for dashboard
   */
  async getStatistics(): Promise<{
    total: number;
    notSold: number;
    sold: number;
    byYear: { year: string; count: number }[];
    byBrand: { brand: string; count: number }[];
    recentlyRegistered: number;
  }> {
    try {
      const vehicles = await this.getAll();
      
      const total = vehicles.length;
      const notSold = vehicles.filter(v => !v.isSold).length;
      const sold = vehicles.filter(v => v.isSold).length;
      
      // Agrupar por ano
      const yearGroups = vehicles.reduce((acc, vehicle) => {
        const year = vehicle.year;
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const byYear = Object.entries(yearGroups)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => b.year.localeCompare(a.year));
      
      // Agrupar por marca
      const brandGroups = vehicles.reduce((acc, vehicle) => {
        const brandName = vehicle.brandName;
        acc[brandName] = (acc[brandName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const byBrand = Object.entries(brandGroups)
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count);
      
      // Veículos registrados na última semana
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const recentlyRegistered = vehicles.filter(vehicle => {
        const registrationDate = new Date(vehicle.createdAt);
        return registrationDate >= lastWeek;
      }).length;
      
      return {
        total,
        notSold,
        sold,
        byYear,
        byBrand,
        recentlyRegistered
      };
    } catch (error) {
      console.error('Error fetching vehicle statistics:', error);
      // Retornar estatísticas vazias em caso de erro
      return {
        total: 0,
        notSold: 0,
        sold: 0,
        byYear: [],
        byBrand: [],
        recentlyRegistered: 0
      };
    }
  },
};
