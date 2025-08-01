"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";
import { BubbleSortResponse, ExerciseService } from "@/lib/exercise-service";

export default function BubbleSortForm() {
    const [arrayInput, setArrayInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [originalArray, setOriginalArray] = useState<number[]>([]);
    const [sortedArray, setSortedArray] = useState<number[]>([]);
    const [response, setResponse] = useState<BubbleSortResponse | null>(null);

    const parseArrayInput = (input: string): number[] | null => {
        try {
        // Remove spaces and split by comma
        const numbers = input
            .split(',')
            .map(item => {
                const num = parseInt(item.trim());
                if (isNaN(num)) throw new Error('Invalid number');
                return num;
            });
        
        if (numbers.length === 0) throw new Error('Empty array');
            return numbers;
        } catch {
            return null;
        }
    };

    const handleBubbleSort = async () => {
        if (!arrayInput) {
            toast({
                title: "Erro de validação",
                description: "O vetor não pode estar vazio!",
                variant: "destructive",
            });
            return;
        }

        const parsedArray = parseArrayInput(arrayInput);
        if (!parsedArray) {
            toast({
                title: "Erro de validação",
                description: "O vetor deve conter apenas números inteiros separados por vírgula!",
                variant: "destructive",
            });
            return;
        }

        setOriginalArray([...parsedArray]);
        setIsLoading(true);
        
        try {
            const response = await ExerciseService.bubbleSort(parsedArray);

            setResponse({
                originalArray: parsedArray,
                sortedArray: response.sortedArray,
                comparisons: response.comparisons,
                swaps: response.swaps,
                executionTimeMs: response.executionTimeMs,
            });

            toast({
                title: "Ordenação concluída",
                description: "O vetor foi ordenado com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao ordenar o vetor:", error);
            toast({
                title: "Erro ao ordenar",
                description: "Ocorreu um erro ao tentar ordenar o vetor.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setIsLoading(false);
        setArrayInput("");
        setOriginalArray([]);
        setSortedArray([]);
    };

    return (
        <div className="space-y-6">
            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Bubble Sort</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="arrayInput">Vetor de Inteiros</Label>
                        <Input
                            id="arrayInput"
                            type="text"
                            placeholder="5, 3, 2, 4, 7, 1, 0, 6"
                            value={arrayInput}
                            onChange={(e) => setArrayInput(e.target.value)}
                            className="font-mono"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Digite números inteiros separados por vírgula
                        </p>
                    </div>

                    {/* Show arrays */}
                    {originalArray.length > 0 && (
                        <div className="space-y-3">
                            <div>
                                <Label>Vetor Original:</Label>
                                <div className="bg-gray-100 p-2 rounded-md font-mono">
                                    [{originalArray.join(', ')}]
                                </div>
                            </div>
                            
                            {response && (
                                <div>
                                    <Label>Vetor Ordenado:</Label>
                                    <div className="bg-green-100 p-2 rounded-md font-mono">
                                        [{response.sortedArray.join(', ')}]
                                    </div>
                                    <Label>Comparações:</Label>
                                    <div className="bg-yellow-100 p-2 rounded-md font-mono">
                                        {`Comparações: ${response.comparisons}`}
                                    </div>
                                    <Label>Trocas:</Label>
                                    <div className="bg-yellow-100 p-2 rounded-md font-mono">
                                        {`Trocas: ${response.swaps}`}
                                    </div>
                                    <Label>Tempo de Execução:</Label>
                                    <div className="bg-yellow-100 p-2 rounded-md font-mono">
                                        {`Tempo de Execução: ${response.executionTimeMs} ms`}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button onClick={handleBubbleSort} disabled={isLoading}>
                            {isLoading ? "Ordenando..." : "Ordenar"}
                        </Button>
                        <Button onClick={reset} variant="outline" disabled={isLoading}>
                            Resetar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};