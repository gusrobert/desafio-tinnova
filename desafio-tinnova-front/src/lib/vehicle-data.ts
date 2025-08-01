import { endpoints } from './api-config';
import { ApiClient } from './api-client';

export interface VehicleBrand {
  id: string;
  name: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  brandId: string;
}

// Cache para evitar múltiplas requisições
let brandsCache: VehicleBrand[] | null = null;
const modelsCache = new Map<string, VehicleModel[]>();

// Utilitários para buscar dados da API
export const vehicleDataService = {
  /**
   * Obter todas as marcas
   */
  async getAllBrands(): Promise<VehicleBrand[]> {
    if (brandsCache) {
      return brandsCache;
    }

    try {
      const brands = await ApiClient.get<VehicleBrand[]>(endpoints.vehicles.brands);
      brandsCache = brands;
      return brands;
    } catch (error) {
      console.error('Error fetching vehicle brands:', error);
      // Fallback para dados locais em caso de erro
      return this.getFallbackBrands();
    }
  },

  /**
   * Obter marca por ID
   */
  async getBrandById(brandId: string): Promise<VehicleBrand | undefined> {
    try {
      const brand = await ApiClient.get<VehicleBrand>(endpoints.vehicles.brandById(brandId));
      return brand;
    } catch (error) {
      console.error(`Error fetching brand ${brandId}:`, error);
      const brands = await this.getAllBrands();
      return brands.find(brand => brand.id === brandId);
    }
  },

  /**
   * Obter modelos por marca
   */
  async getModelsByBrand(brandId: string): Promise<VehicleModel[]> {
    if (modelsCache.has(brandId)) {
      return modelsCache.get(brandId)!;
    }

    try {
      const models = await ApiClient.get<VehicleModel[]>(endpoints.vehicles.modelsByBrand(brandId));
      modelsCache.set(brandId, models);
      return models;
    } catch (error) {
      console.error(`Error fetching models for brand ${brandId}:`, error);
      // Fallback para dados locais em caso de erro
      return this.getFallbackModels(brandId);
    }
  },

  /**
   * Obter modelo por ID
   */
  async getModelById(modelId: string): Promise<VehicleModel | undefined> {
    try {
      const model = await ApiClient.get<VehicleModel>(endpoints.vehicles.modelById(modelId));
      return model;
    } catch (error) {
      console.error(`Error fetching model ${modelId}:`, error);
      // Buscar em todos os modelos em cache
      for (const [brandId, models] of modelsCache.entries()) {
        const model = models.find(m => m.id === modelId);
        if (model) return model;
      }
      return undefined;
    }
  },

  /**
   * Obter nome da marca por ID (versão síncrona para compatibilidade)
   */
  getBrandName(brandId: string): string {
    // Para compatibilidade com código existente, retorna o ID se não encontrar
    return brandId;
  },

  /**
   * Obter nome do modelo por ID (versão síncrona para compatibilidade)
   */
  getModelName(modelId: string): string {
    // Para compatibilidade com código existente, retorna o ID se não encontrar
    return modelId;
  },

  /**
   * Obter nome da marca por ID (versão assíncrona)
   */
  async getBrandNameAsync(brandId: string): Promise<string> {
    const brand = await this.getBrandById(brandId);
    return brand ? brand.name : brandId;
  },

  /**
   * Obter nome do modelo por ID (versão assíncrona)
   */
  async getModelNameAsync(modelId: string): Promise<string> {
    const model = await this.getModelById(modelId);
    return model ? model.name : modelId;
  },

  /**
   * Buscar marcas por texto
   */
  async searchBrands(query: string): Promise<VehicleBrand[]> {
    const brands = await this.getAllBrands();
    const searchTerm = query.toLowerCase();
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Buscar modelos por texto
   */
  async searchModels(brandId: string, query: string): Promise<VehicleModel[]> {
    const models = await this.getModelsByBrand(brandId);
    const searchTerm = query.toLowerCase();
    return models.filter(model => 
      model.name.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Limpar cache
   */
  clearCache(): void {
    brandsCache = null;
    modelsCache.clear();
  },

  /**
   * Dados fallback em caso de erro na API
   */
  getFallbackBrands(): VehicleBrand[] {
    return [
      { id: "toyota", name: "Toyota" },
      { id: "honda", name: "Honda" },
      { id: "volkswagen", name: "Volkswagen" },
      { id: "chevrolet", name: "Chevrolet" },
      { id: "ford", name: "Ford" },
      { id: "hyundai", name: "Hyundai" },
      { id: "nissan", name: "Nissan" }
    ];
  },

  getFallbackModels(brandId: string): VehicleModel[] {
    const allModels: Record<string, VehicleModel[]> = {
      toyota: [
        { id: "corolla", name: "Corolla", brandId: "toyota" },
        { id: "camry", name: "Camry", brandId: "toyota" },
        { id: "prius", name: "Prius", brandId: "toyota" },
        { id: "rav4", name: "RAV4", brandId: "toyota" },
        { id: "hilux", name: "Hilux", brandId: "toyota" },
      ],
      honda: [
        { id: "civic", name: "Civic", brandId: "honda" },
        { id: "accord", name: "Accord", brandId: "honda" },
        { id: "crv", name: "CR-V", brandId: "honda" },
        { id: "hrv", name: "HR-V", brandId: "honda" },
        { id: "fit", name: "Fit", brandId: "honda" },
      ]
    };
    return allModels[brandId] || [];
  }
};
