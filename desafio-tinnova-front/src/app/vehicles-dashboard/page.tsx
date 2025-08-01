"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import VehicleStatsCards from "@/components/dashboard/VehicleStatsCards";
import VehicleDistributionChart from "@/components/dashboard/VehicleDistributionChart";
import VehicleBrandChart from "@/components/dashboard/VehicleBrandChart";
import { vehicleService } from "@/lib/vehicle-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface VehicleStats {
  total: number;
  notSold: number;
  sold: number;
  byYear: { year: string; count: number }[];
  byBrand: { brand: string; count: number }[];
  recentlyRegistered: number;
}

export default function VehiclesDashboardPage() {
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error loading vehicle statistics:', err);
      setError('Erro ao carregar estatísticas dos veículos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Dashboard de Veículos">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout pageTitle="Dashboard de Veículos">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  if (!stats) {
    return (
      <AppLayout pageTitle="Dashboard de Veículos">
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Nenhum dado encontrado</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Dashboard de Veículos">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Veículos</h1>
            <p className="text-muted-foreground">
              Visão geral dos veículos cadastrados no sistema
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <VehicleStatsCards stats={stats} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VehicleDistributionChart 
            data={stats.byYear} 
            title="Distribuição por Ano de Fabricação"
          />
          <VehicleBrandChart data={stats.byBrand} />
        </div>

        {/* Summary */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo Executivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Status dos Veículos:</p>
              <p className="text-muted-foreground">
                {stats.notSold} veículos disponíveis para venda de um total de {stats.total}
              </p>
            </div>
            <div>
              <p className="font-medium">Taxa de Vendas:</p>
              <p className="text-muted-foreground">
                {stats.total > 0 ? ((stats.sold / stats.total) * 100).toFixed(1) : 0}% dos veículos foram vendidos
              </p>
            </div>
            <div>
              <p className="font-medium">Atividade Recente:</p>
              <p className="text-muted-foreground">
                {stats.recentlyRegistered} veículos registrados na última semana
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
