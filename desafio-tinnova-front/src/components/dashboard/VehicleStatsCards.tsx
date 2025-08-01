import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ShoppingCart, Calendar, TrendingUp } from "lucide-react";

interface VehicleStatsCardsProps {
  stats: {
    total: number;
    notSold: number;
    sold: number;
    recentlyRegistered: number;
  };
}

export default function VehicleStatsCards({ stats }: VehicleStatsCardsProps) {
  const cards = [
    {
      title: "Total de Veículos",
      value: stats.total,
      icon: Car,
      description: "Veículos cadastrados",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Não Vendidos",
      value: stats.notSold,
      icon: Calendar,
      description: "Disponíveis para venda",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Vendidos",
      value: stats.sold,
      icon: ShoppingCart,
      description: "Veículos vendidos",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Registrados Recentemente",
      value: stats.recentlyRegistered,
      icon: TrendingUp,
      description: "Última semana",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
