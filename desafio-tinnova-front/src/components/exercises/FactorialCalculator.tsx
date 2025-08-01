"use client";

import { ExerciseService } from "@/lib/exercise-service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

export default function FactorialCalculatorForm() {
    const [result, setResult] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [number, setNumber] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(e.target.value);
        setResult(null); // Limpa o resultado quando o usuário muda o número
    };
    
    const calculateFactorial = async () => {
        const numericValue = Number(number);
        
        if (!number || isNaN(numericValue) || numericValue < 0) {
            alert("Por favor, insira um número válido (não negativo).");
            return;
        }

        setIsLoading(true);
        try {
            const factorialResult = await ExerciseService.calculateFactorial(numericValue);
            setResult(factorialResult);
        } catch (error) {
            console.error("Erro ao calcular fatorial:", error);
            alert("Ocorreu um erro ao calcular o fatorial. Verifique o console para mais detalhes.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Calculadora de Fatorial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="number">Número</Label>
                            <Input
                                id="number"
                                type="number"
                                min="0"
                                placeholder="Digite um número"
                                value={number}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <Button 
                        onClick={calculateFactorial}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Calcular Fatorial
                    </Button>
                </CardContent>
            </Card>
            {/* Result */}
            {result !== null && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent>
                        <p>O fatorial de {number} é {result}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
