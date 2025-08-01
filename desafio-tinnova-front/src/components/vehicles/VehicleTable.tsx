"use client";

import { useState, useMemo } from "react";
import type { Vehicle } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ArrowUpDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: number) => void; 
}

type SortKey = keyof Pick<Vehicle, "plate" | "modelName" | "brandName" | "year" | "isSold">;


export default function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("modelName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedVehicles = useMemo(() => {
    // Verificar se vehicles existe e é um array
    if (!vehicles || !Array.isArray(vehicles)) {
      return [];
    }
    
    // RQF6.2: A tabela de listagem de veículos deve estar em ordem alfabética (default).
    let filtered = vehicles.filter(
      (vehicle) => {
        // Verificações de segurança para evitar erros
        const plateValue = vehicle.plate?.toLowerCase() || '';
        const modelName = vehicle.modelName?.toLowerCase() || '';
        const brandName = vehicle.brandName?.toLowerCase() || '';
        const yearValue = vehicle.year?.toString() || '';
        const descriptionValue = vehicle.description?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return (
          plateValue.includes(searchLower) ||
          modelName.includes(searchLower) ||
          brandName.includes(searchLower) ||
          yearValue.includes(searchTerm) ||
          descriptionValue.includes(searchLower)
        );
      }
    );

    return filtered.sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];

      // Handle boolean values for isSold
      if (sortKey === 'isSold') {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      }

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortOrder === "asc" ? comparison : comparison * -1;
    });
  }, [vehicles, searchTerm, sortKey, sortOrder]);

  const confirmDelete = () => {
    if (vehicleToDelete) {
      onDelete(vehicleToDelete.id);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md w-full">
       <div className="px-6 pt-6 mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por placa, modelo, marca, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("plate")} className="cursor-pointer hover:bg-muted/50">
                Placa <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'plate' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("modelName")} className="cursor-pointer hover:bg-muted/50">
                Modelo <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'modelName' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("brandName")} className="cursor-pointer hover:bg-muted/50">
                Marca <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'brandName' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("year")} className="cursor-pointer hover:bg-muted/50">
                Ano <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'year' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead onClick={() => handleSort("isSold")} className="cursor-pointer hover:bg-muted/50">
                Vendido <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortKey === 'isSold' ? 'text-primary' : ''}`} />
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedVehicles.length > 0 ? (
              filteredAndSortedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    {vehicle.plate || '-'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {vehicle.modelName || '-'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {vehicle.brandName || '-'}
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.year || '-'}</TableCell>
                  <TableCell className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.isSold 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.isSold ? 'Vendido' : 'Disponível'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setVehicleToDelete(vehicle)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Nenhum veículo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {vehicleToDelete && (
         <DeleteConfirmationDialog
          isOpen={!!vehicleToDelete}
          onOpenChange={() => setVehicleToDelete(null)}
          onConfirm={confirmDelete}
          itemName={`${vehicleToDelete.brandName || ''} ${vehicleToDelete.modelName || ''}`.trim() || 'Veículo'}
          itemType="veículo"
        />
      )}
    </div>
  );
}
