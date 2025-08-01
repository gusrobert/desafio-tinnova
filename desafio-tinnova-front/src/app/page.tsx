import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Calculator, 
  Car, 
  BarChart3, 
  Code, 
  Database, 
  Globe, 
  ArrowUpDown,
  Hash,
  Percent,
  ExternalLink
} from "lucide-react";

export default function ExercisesPage() {
  return (
    <AppLayout pageTitle="Bem-vindo ao Desafio Tinnova">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Desafio Tinnova
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Sistema de gerenciamento de veículos com soluções para exercícios de programação, 
            construído com Next.js e Spring Boot.
          </p>
        </section>

        {/* Technologies Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            🚀 Tecnologias Utilizadas
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Frontend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js 15</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">TailwindCSS</Badge>
                  <Badge variant="secondary">Shadcn/ui</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Spring Boot 3.5</Badge>
                  <Badge variant="secondary">Java 17</Badge>
                  <Badge variant="secondary">PostgreSQL 15</Badge>
                  <Badge variant="secondary">Docker</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            📋 Funcionalidades
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
             <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-6 w-6 text-green-600" />
                  Gestão de Veículos
                </CardTitle>
                <CardDescription>
                  Sistema completo de cadastro e gerenciamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/vehicles">
                  <Button className="w-full">
                    Gerenciar Veículos
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  Dashboard
                </CardTitle>
                <CardDescription>
                  Painel de controle com informações resumidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full">
                    Ver Dashboard
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Exercises Details */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            🧮 Exercícios Implementados
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/exercises/exercise-1">
              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <Percent className="h-5 w-5 text-blue-500" />
                    Eleição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cálculo de porcentagens de votos válidos, brancos e nulos
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/exercises/exercise-2">
              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <ArrowUpDown className="h-5 w-5 text-green-500" />
                    Bubble Sort
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Algoritmo de ordenação com contagem de iterações
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/exercises/exercise-3">
              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <Hash className="h-5 w-5 text-purple-500" />
                    Fatorial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cálculo recursivo do fatorial de um número
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/exercises/exercise-4">
              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-orange-500" />
                    Múltiplos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Soma de múltiplos de 3 ou 5 abaixo de um número
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            🏁 Como Começar
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Instruções de Uso</CardTitle>
              <CardDescription>
                Explore as funcionalidades do sistema navegando pelas seções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Para testar os exercícios:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acesse a seção "Exercícios" no menu lateral para testar as implementações 
                    dos algoritmos e ver os resultados em tempo real.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Para gerenciar veículos:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use a seção "Veículos" para cadastrar, editar e visualizar veículos 
                    com marcas e modelos pré-definidos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
