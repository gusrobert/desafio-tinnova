export interface Vehicle {
  id: number;
  plate: string;
  modelId: number;
  brandId: number;
  brandName: string;
  modelName: string;
  year: number;
  description?: string;
  isSold: boolean;
  createdAt: string; // ISO string for date
  updatedAt: string; // ISO string for date
}
