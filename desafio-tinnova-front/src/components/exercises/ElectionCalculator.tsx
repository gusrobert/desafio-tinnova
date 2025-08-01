"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ExerciseService } from "@/lib/exercise-service";
import { useState } from "react";

interface ElectionResult {
  validVotePercentage: number;
  blankVotePercentage: number;
  nullVotePercentage: number;
}

export default function ElectionCalculatorForm() {
  const [totalVoters, setTotalVoters] = useState<number>(1000);
  const [validVotes, setValidVotes] = useState<number>(800);
  const [blankVotes, setBlankVotes] = useState<number>(150);
  const [nullVotes, setNullVotes] = useState<number>(50);
  const [result, setResult] = useState<ElectionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const calculatePercentages = async () => {
    if (totalVoters <= 0) {
      toast({
        title: "Erro de validação",
        description: "Total de eleitores deve ser maior que zero!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const data = {
        totalVoters,
        validVotes,
        blankVotes,
        nullVotes,
      };

      const percentages = await ExerciseService.calculateElectionPercentages(data);
      
      setResult({
        validVotePercentage: percentages.validVotePercentage,
        blankVotePercentage: percentages.blankVotePercentage,
        nullVotePercentage: percentages.nullVotePercentage,
      });

      toast({
        title: "Cálculo realizado com sucesso!",
        description: "Os percentuais foram calculados pelo backend.",
      });
    } catch (error) {
      console.error("Erro ao calcular percentuais:", error);
      toast({
        title: "Erro ao calcular percentuais",
        description: "Ocorreu um erro ao calcular os percentuais. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setTotalVoters(1000);
    setValidVotes(800);
    setBlankVotes(150);
    setNullVotes(50);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Eleição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalVoters">Total de Eleitores</Label>
              <Input
                id="totalVoters"
                type="number"
                value={totalVoters}
                onChange={(e) => setTotalVoters(Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="validVotes">Votos Válidos</Label>
              <Input
                id="validVotes"
                type="number"
                value={validVotes}
                onChange={(e) => setValidVotes(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="blankVotes">Votos Brancos</Label>
              <Input
                id="blankVotes"
                type="number"
                value={blankVotes}
                onChange={(e) => setBlankVotes(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="nullVotes">Votos Nulos</Label>
              <Input
                id="nullVotes"
                type="number"
                value={nullVotes}
                onChange={(e) => setNullVotes(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={calculatePercentages} 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Calculando..." : "Calcular Percentuais"}
            </Button>
            <Button onClick={reset} variant="outline" disabled={isLoading}>
              Resetar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Percentual de Válidos:</span>
                <span className="font-semibold">{result.validVotePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Percentual de Brancos:</span>
                <span className="font-semibold">{result.blankVotePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Percentual de Nulos:</span>
                <span className="font-semibold">{result.nullVotePercentage.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
