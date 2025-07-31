"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultadoEleicao {
  percentualValidos: number;
  percentualBrancos: number;
  percentualNulos: number;
}

export default function CalculadoraEleicaoForm() {
  const [totalEleitores, setTotalEleitores] = useState<number>(1000);
  const [validos, setValidos] = useState<number>(800);
  const [brancos, setBrancos] = useState<number>(150);
  const [nulos, setNulos] = useState<number>(50);
  const [resultado, setResultado] = useState<ResultadoEleicao | null>(null);

  const calcularPercentuais = () => {
    if (totalEleitores <= 0) {
      alert("Total de eleitores deve ser maior que zero!");
      return;
    }

    const percentualValidos = (validos / totalEleitores) * 100;
    const percentualBrancos = (brancos / totalEleitores) * 100;
    const percentualNulos = (nulos / totalEleitores) * 100;

    setResultado({
      percentualValidos,
      percentualBrancos,
      percentualNulos,
    });
  };

  const resetar = () => {
    setTotalEleitores(1000);
    setValidos(800);
    setBrancos(150);
    setNulos(50);
    setResultado(null);
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Eleição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEleitores">Total de Eleitores</Label>
              <Input
                id="totalEleitores"
                type="number"
                value={totalEleitores}
                onChange={(e) => setTotalEleitores(Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="validos">Votos Válidos</Label>
              <Input
                id="validos"
                type="number"
                value={validos}
                onChange={(e) => setValidos(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="brancos">Votos Brancos</Label>
              <Input
                id="brancos"
                type="number"
                value={brancos}
                onChange={(e) => setBrancos(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="nulos">Votos Nulos</Label>
              <Input
                id="nulos"
                type="number"
                value={nulos}
                onChange={(e) => setNulos(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={calcularPercentuais} className="flex-1">
              Calcular Percentuais
            </Button>
            <Button onClick={resetar} variant="outline">
              Resetar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resultado && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Percentual de Válidos:</span>
                <span className="font-semibold">{resultado.percentualValidos.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Percentual de Brancos:</span>
                <span className="font-semibold">{resultado.percentualBrancos.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Percentual de Nulos:</span>
                <span className="font-semibold">{resultado.percentualNulos.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
