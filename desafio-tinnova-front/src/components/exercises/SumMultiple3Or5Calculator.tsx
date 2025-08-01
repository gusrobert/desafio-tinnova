"use client";

import { ExerciseService } from "@/lib/exercise-service";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Car } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SumMultipleOf3Or5Form() {
    const [number, setNumber] = useState<string>("");
    const [result, setResult] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(e.target.value);
        setResult(null); // Limpa o resultado quando o usuário muda o número
    }

    const calculateSum = async () => {
        const numericValue = Number(number);
        
        if (!number || isNaN(numericValue) || numericValue < 0) {
            alert("Por favor, insira um número válido (não negativo).");
            return;
        }

        setIsLoading(true);
        try {
            const sum = await ExerciseService.sumMultiplesOf3And5(numericValue);
            setResult(sum);
        } catch (error) {
            console.error("Erro ao calcular a soma:", error);
            alert("Ocorreu um erro ao calcular a soma. Verifique o console para mais detalhes.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Soma dos múltiplos de 3 ou 5</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</Label>
                    <Input
                        id="number"
                        type="number"
                        min="0"
                        placeholder="Digite um número"
                        value={number}
                        onChange={handleInputChange}
                    />
                    <Button
                        onClick={calculateSum}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? "Calculando..." : "Calcular Soma"}
                    </Button>
                </CardContent>
            </Card>


            {/* Resultado */}
            {result !== null && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                    <h3 className="text-lg font-semibold">Resultado:</h3>
                    <p className="text-xl">{result}</p>
                </div>
            )}
        </div>
    );        
}